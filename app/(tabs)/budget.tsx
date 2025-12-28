
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { usePremiumEnforcement } from "@/hooks/usePremiumEnforcement";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLimitTracking } from "@/contexts/LimitTrackingContext";

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

interface MonthData {
  id: string;
  name: string;
  isPinned: boolean;
  budgetItems: BudgetItem[];
  accountBalance: number;
}

const MONTHS = [
  'JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI',
  'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER'
];

export default function BudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const { shouldRollback, setShouldRollback, lastAction, clearLastAction, setLastAction } = useLimitTracking();
  const [isPremium, setIsPremium] = useState(false);
  const [months, setMonths] = useState<MonthData[]>([
    {
      id: '1',
      name: 'DEZEMBER',
      isPinned: false,
      accountBalance: 13556,
      budgetItems: [
        { id: '1', name: 'SPAREN', amount: 1500, isPinned: false },
        { id: '2', name: 'KRANKEN KASSE', amount: 450, isPinned: false },
        { id: '3', name: 'ESSEN', amount: 650, isPinned: false },
        { id: '4', name: 'MIETE', amount: 2500, isPinned: false },
        { id: '5', name: 'SPAREN', amount: 1146, isPinned: false },
        { id: '6', name: 'SPAREN', amount: 1146, isPinned: false },
      ],
    },
  ]);
  
  const [selectedMonthId, setSelectedMonthId] = useState('1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  
  // Month menu state
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [selectedMonthForMenu, setSelectedMonthForMenu] = useState<string | null>(null);
  
  // Item menu state
  const [showItemMenu, setShowItemMenu] = useState(false);
  const [selectedItemForMenu, setSelectedItemForMenu] = useState<string | null>(null);
  
  // Edit modals
  const [showEditBalanceModal, setShowEditBalanceModal] = useState(false);
  const [showEditBalanceLabelModal, setShowEditBalanceLabelModal] = useState(false);
  const [editBalanceValue, setEditBalanceValue] = useState('');
  const [editBalanceLabel, setEditBalanceLabel] = useState('KONTOSTAND');
  
  const [showEditItemNameModal, setShowEditItemNameModal] = useState(false);
  const [showEditItemAmountModal, setShowEditItemAmountModal] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editItemAmount, setEditItemAmount] = useState('');
  
  const [showEditMonthNameModal, setShowEditMonthNameModal] = useState(false);
  const [editMonthName, setEditMonthName] = useState('');

  const selectedMonth = months.find(m => m.id === selectedMonthId);
  const accountBalance = selectedMonth?.accountBalance || 0;
  const budgetItems = selectedMonth?.budgetItems || [];
  
  // Calculate max expenses per month for premium enforcement
  const maxExpensesPerMonth = Math.max(...months.map(m => m.budgetItems.length), 0);
  
  // Premium enforcement hook (now disabled)
  const { canPerformAction, redirectToPremium } = usePremiumEnforcement({
    monthsCount: months.length,
    maxExpensesPerMonth,
    subscriptionsCount: 0, // This will be passed from abo screen
    isPremium,
  });

  // Handle rollback when user closes premium modal after hitting limit
  // NOTE: This is no longer needed since limits are removed, but keeping for compatibility
  useEffect(() => {
    if (shouldRollback && lastAction) {
      console.log('Rolling back last action:', lastAction);
      
      if (lastAction.type === 'addMonth' && lastAction.data?.monthId) {
        // Remove the last added month
        setMonths(prevMonths => prevMonths.filter(m => m.id !== lastAction.data.monthId));
        console.log('Rolled back month addition:', lastAction.data.monthId);
      } else if (lastAction.type === 'addExpense' && lastAction.data?.itemId && lastAction.data?.monthId) {
        // Remove the last added expense
        setMonths(prevMonths => prevMonths.map(m => 
          m.id === lastAction.data.monthId 
            ? { ...m, budgetItems: m.budgetItems.filter(item => item.id !== lastAction.data.itemId) }
            : m
        ));
        console.log('Rolled back expense addition:', lastAction.data.itemId);
      }
      
      // Clear the rollback flag and last action
      clearLastAction();
    }
  }, [shouldRollback, lastAction]);
  
  // Sort items: pinned first, then by creation order
  const sortedBudgetItems = [...budgetItems].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
  
  // Sort months: pinned first, then by creation order
  const sortedMonths = [...months].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = accountBalance - totalExpenses;

  const handleAddItem = () => {
    if (newItemName && newItemAmount && selectedMonth) {
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        name: newItemName.toUpperCase(),
        amount: parseFloat(newItemAmount),
        isPinned: false,
      };
      
      // No limit check - just add the item
      setMonths(months.map(m => 
        m.id === selectedMonthId 
          ? { ...m, budgetItems: [...m.budgetItems, newItem] }
          : m
      ));
      
      setNewItemName('');
      setNewItemAmount('');
      setShowAddModal(false);
      console.log('Added expense without limit check:', newItem);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setMonths(months.map(m => 
      m.id === selectedMonthId 
        ? { ...m, budgetItems: m.budgetItems.filter(item => item.id !== itemId) }
        : m
    ));
  };

  const handleDeleteMonth = (monthId: string) => {
    if (months.length === 1) {
      Alert.alert(t('errorTitle'), t('errorMinimumMonth'));
      return;
    }
    
    setMonths(months.filter(m => m.id !== monthId));
    
    // If we deleted the selected month, select the first remaining month
    if (monthId === selectedMonthId) {
      const remainingMonths = months.filter(m => m.id !== monthId);
      if (remainingMonths.length > 0) {
        setSelectedMonthId(remainingMonths[0].id);
      }
    }
  };

  const handleAddMonth = () => {
    const newMonth: MonthData = {
      id: Date.now().toString(),
      name: 'NEUER MONAT',
      isPinned: false,
      accountBalance: 0,
      budgetItems: [],
    };
    
    // No limit check - just add the month
    setMonths([...months, newMonth]);
    setSelectedMonthId(newMonth.id);
    console.log('Added month without limit check:', newMonth);
  };

  const handleLongPressMonth = (monthId: string) => {
    setSelectedMonthForMenu(monthId);
    setShowMonthMenu(true);
  };

  const handlePinMonth = () => {
    if (selectedMonthForMenu) {
      setMonths(months.map(m => 
        m.id === selectedMonthForMenu 
          ? { ...m, isPinned: !m.isPinned }
          : m
      ));
    }
    setShowMonthMenu(false);
    setSelectedMonthForMenu(null);
  };

  const handleDuplicateMonth = () => {
    if (selectedMonthForMenu) {
      const monthToDuplicate = months.find(m => m.id === selectedMonthForMenu);
      if (monthToDuplicate) {
        const duplicatedMonth: MonthData = {
          ...monthToDuplicate,
          id: Date.now().toString(),
          name: `${monthToDuplicate.name} (KOPIE)`,
          isPinned: false,
          budgetItems: monthToDuplicate.budgetItems.map(item => ({
            ...item,
            id: `${Date.now()}-${item.id}`,
            isPinned: false,
          })),
        };
        
        // No limit check - just duplicate the month
        setMonths([...months, duplicatedMonth]);
        console.log('Duplicated month without limit check:', duplicatedMonth);
      }
    }
    setShowMonthMenu(false);
    setSelectedMonthForMenu(null);
  };

  const handleRenameMonth = () => {
    const month = months.find(m => m.id === selectedMonthForMenu);
    if (month) {
      setEditMonthName(month.name);
      setShowMonthMenu(false);
      setShowEditMonthNameModal(true);
    }
  };

  const handleSaveMonthName = () => {
    if (selectedMonthForMenu && editMonthName) {
      setMonths(months.map(m => 
        m.id === selectedMonthForMenu 
          ? { ...m, name: editMonthName.toUpperCase() }
          : m
      ));
    }
    setShowEditMonthNameModal(false);
    setSelectedMonthForMenu(null);
    setEditMonthName('');
  };

  const handleLongPressItem = (itemId: string) => {
    setSelectedItemForMenu(itemId);
    setShowItemMenu(true);
  };

  const handlePinItem = () => {
    if (selectedItemForMenu) {
      setMonths(months.map(m => 
        m.id === selectedMonthId 
          ? {
              ...m,
              budgetItems: m.budgetItems.map(item =>
                item.id === selectedItemForMenu
                  ? { ...item, isPinned: !item.isPinned }
                  : item
              ),
            }
          : m
      ));
    }
    setShowItemMenu(false);
    setSelectedItemForMenu(null);
  };

  const handleDuplicateItem = () => {
    if (selectedItemForMenu) {
      const itemToDuplicate = budgetItems.find(item => item.id === selectedItemForMenu);
      if (itemToDuplicate) {
        const duplicatedItem: BudgetItem = {
          ...itemToDuplicate,
          id: Date.now().toString(),
          isPinned: false,
        };
        
        // No limit check - just duplicate the item
        setMonths(months.map(m => 
          m.id === selectedMonthId 
            ? { ...m, budgetItems: [...m.budgetItems, duplicatedItem] }
            : m
        ));
        console.log('Duplicated expense without limit check:', duplicatedItem);
      }
    }
    setShowItemMenu(false);
    setSelectedItemForMenu(null);
  };

  const handleRenameItem = () => {
    const item = budgetItems.find(i => i.id === selectedItemForMenu);
    if (item) {
      setEditItemName(item.name);
      setShowItemMenu(false);
      setShowEditItemNameModal(true);
    }
  };

  const handleEditItemAmount = () => {
    const item = budgetItems.find(i => i.id === selectedItemForMenu);
    if (item) {
      setEditItemAmount(item.amount.toString());
      setShowItemMenu(false);
      setShowEditItemAmountModal(true);
    }
  };

  const handleSaveItemName = () => {
    if (selectedItemForMenu && editItemName) {
      setMonths(months.map(m => 
        m.id === selectedMonthId 
          ? {
              ...m,
              budgetItems: m.budgetItems.map(item =>
                item.id === selectedItemForMenu
                  ? { ...item, name: editItemName.toUpperCase() }
                  : item
              ),
            }
          : m
      ));
    }
    setShowEditItemNameModal(false);
    setSelectedItemForMenu(null);
    setEditItemName('');
  };

  const handleSaveItemAmount = () => {
    if (selectedItemForMenu && editItemAmount) {
      setMonths(months.map(m => 
        m.id === selectedMonthId 
          ? {
              ...m,
              budgetItems: m.budgetItems.map(item =>
                item.id === selectedItemForMenu
                  ? { ...item, amount: parseFloat(editItemAmount) }
                  : item
              ),
            }
          : m
      ));
    }
    setShowEditItemAmountModal(false);
    setSelectedItemForMenu(null);
    setEditItemAmount('');
  };

  const handleEditBalance = () => {
    setEditBalanceValue(accountBalance.toString());
    setShowEditBalanceModal(true);
  };

  const handleSaveBalance = () => {
    if (editBalanceValue) {
      setMonths(months.map(m => 
        m.id === selectedMonthId 
          ? { ...m, accountBalance: parseFloat(editBalanceValue) }
          : m
      ));
    }
    setShowEditBalanceModal(false);
    setEditBalanceValue('');
  };

  const handleEditBalanceLabel = () => {
    setShowEditBalanceLabelModal(true);
  };

  const handleSaveBalanceLabel = () => {
    setShowEditBalanceLabelModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Snow animation background */}
      <SnowAnimation />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Balance Card - Title top-left, Number bottom-right, moved lower */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceNewLayout}>
            <TouchableOpacity 
              onPress={handleEditBalanceLabel}
              style={styles.balanceLabelContainer}
            >
              <Text style={[styles.balanceLabel, { fontSize: 19 }]}>{editBalanceLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleEditBalance}
              style={styles.balanceAmountContainer}
            >
              <Text style={[styles.balanceAmount, { marginBottom: 1, fontSize: 37 }]}>{accountBalance.toLocaleString('de-DE')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total and Remaining */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('total')}</Text>
            <Text style={styles.summaryAmount}>{totalExpenses.toLocaleString('de-DE')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('remaining')}</Text>
            <Text style={[styles.summaryAmount, remaining < 0 ? styles.negativeAmount : styles.remainingAmount]}>
              {remaining.toLocaleString('de-DE')}
            </Text>
          </View>
        </View>

        {/* Month Selector - Horizontal Scroll */}
        <View style={styles.monthSelectorContainer}>
          <TouchableOpacity style={styles.addMonthButton} onPress={handleAddMonth}>
            <IconSymbol 
              ios_icon_name="plus.circle.fill" 
              android_material_icon_name="add-circle" 
              size={24} 
              color={colors.green} 
            />
          </TouchableOpacity>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.monthScrollView}
            contentContainerStyle={styles.monthScrollContent}
          >
            {sortedMonths.map((month, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity 
                  style={[
                    styles.monthButton,
                    month.id === selectedMonthId && styles.selectedMonthButton,
                    month.isPinned && styles.pinnedMonthButton,
                  ]}
                  onPress={() => setSelectedMonthId(month.id)}
                  onLongPress={() => handleLongPressMonth(month.id)}
                  delayLongPress={500}
                >
                  <Text style={styles.monthText}>{month.name}</Text>
                  <TouchableOpacity onPress={() => handleDeleteMonth(month.id)}>
                    <IconSymbol 
                      ios_icon_name="xmark.circle.fill" 
                      android_material_icon_name="cancel" 
                      size={20} 
                      color={colors.red} 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Budget Items Grid - Numbers smaller and closer to bottom */}
        <View style={styles.budgetGrid}>
          {sortedBudgetItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.budgetItem,
                  item.isPinned && styles.pinnedBudgetItem,
                ]}
                onLongPress={() => handleLongPressItem(item.id)}
                delayLongPress={500}
                activeOpacity={0.7}
              >
                <View style={styles.budgetItemHeader}>
                  <Text style={styles.budgetItemName}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                    <IconSymbol 
                      ios_icon_name="xmark.circle.fill" 
                      android_material_icon_name="cancel" 
                      size={20} 
                      color={colors.red} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.budgetItemAmountContainer}>
                  <Text style={styles.budgetItemAmount}>{item.amount.toLocaleString('de-DE')}</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Spacer for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button - Fixed to bottom right at same height as menu */}
      <TouchableOpacity 
        style={styles.floatingAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <IconSymbol 
          ios_icon_name="plus.circle.fill" 
          android_material_icon_name="add-circle" 
          size={56} 
          color={colors.green} 
        />
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('newExpense')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('namePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('amountPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={newItemAmount}
              onChangeText={setNewItemAmount}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleAddItem}
              >
                <Text style={styles.addModalButtonText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Month Menu Modal */}
      <Modal
        visible={showMonthMenu}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowMonthMenu(false);
          setSelectedMonthForMenu(null);
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowMonthMenu(false);
            setSelectedMonthForMenu(null);
          }}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePinMonth}>
              <Text style={styles.menuItemText}>
                {months.find(m => m.id === selectedMonthForMenu)?.isPinned ? t('unpin') : t('pin')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDuplicateMonth}>
              <Text style={styles.menuItemText}>{t('duplicate')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleRenameMonth}>
              <Text style={styles.menuItemText}>{t('rename')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.cancelMenuItem]}
              onPress={() => {
                setShowMonthMenu(false);
                setSelectedMonthForMenu(null);
              }}
            >
              <Text style={styles.menuItemText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Item Menu Modal */}
      <Modal
        visible={showItemMenu}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowItemMenu(false);
          setSelectedItemForMenu(null);
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowItemMenu(false);
            setSelectedItemForMenu(null);
          }}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleRenameItem}>
              <Text style={styles.menuItemText}>{t('rename')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleEditItemAmount}>
              <Text style={styles.menuItemText}>{t('editAmount')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDuplicateItem}>
              <Text style={styles.menuItemText}>{t('duplicate')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handlePinItem}>
              <Text style={styles.menuItemText}>
                {budgetItems.find(i => i.id === selectedItemForMenu)?.isPinned ? t('unpin') : t('pin')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.cancelMenuItem]}
              onPress={() => {
                setShowItemMenu(false);
                setSelectedItemForMenu(null);
              }}
            >
              <Text style={styles.menuItemText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Balance Modal */}
      <Modal
        visible={showEditBalanceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditBalanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('adjustBalance')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('amountPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={editBalanceValue}
              onChangeText={setEditBalanceValue}
              keyboardType="numeric"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditBalanceModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveBalance}
              >
                <Text style={styles.addModalButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Balance Label Modal */}
      <Modal
        visible={showEditBalanceLabelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditBalanceLabelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('adjustLabel')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('labelPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={editBalanceLabel}
              onChangeText={setEditBalanceLabel}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditBalanceLabelModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveBalanceLabel}
              >
                <Text style={styles.addModalButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Item Name Modal */}
      <Modal
        visible={showEditItemNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditItemNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('rename')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('name')}
              placeholderTextColor={colors.textSecondary}
              value={editItemName}
              onChangeText={setEditItemName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditItemNameModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveItemName}
              >
                <Text style={styles.addModalButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Item Amount Modal */}
      <Modal
        visible={showEditItemAmountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditItemAmountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editAmount')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('amountPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={editItemAmount}
              onChangeText={setEditItemAmount}
              keyboardType="numeric"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditItemAmountModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveItemAmount}
              >
                <Text style={styles.addModalButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Month Name Modal */}
      <Modal
        visible={showEditMonthNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditMonthNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('adjustMonthName')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('name')}
              placeholderTextColor={colors.textSecondary}
              value={editMonthName}
              onChangeText={setEditMonthName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditMonthNameModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveMonthName}
              >
                <Text style={styles.addModalButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 120,
  },
  balanceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    minHeight: 140,
  },
  balanceNewLayout: {
    flex: 1,
    position: 'relative',
  },
  balanceLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  balanceAmountContainer: {
    position: 'absolute',
    bottom: -8,
    right: 0,
  },
  balanceAmount: {
    fontSize: 46,
    fontWeight: '900',
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  remainingAmount: {
    color: colors.green,
  },
  negativeAmount: {
    color: colors.red,
  },
  monthSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMonthButton: {
    padding: 8,
    marginRight: 8,
  },
  monthScrollView: {
    flex: 1,
  },
  monthScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMonthButton: {
    backgroundColor: colors.grey,
  },
  pinnedMonthButton: {
    borderColor: colors.green,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  budgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  budgetItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '48%',
    height: 140,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pinnedBudgetItem: {
    borderColor: colors.green,
  },
  budgetItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  budgetItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  budgetItemAmountContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  budgetItemAmount: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.grey,
  },
  addModalButton: {
    backgroundColor: colors.green,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  menuContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 8,
    width: '80%',
    maxWidth: 300,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  cancelMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
