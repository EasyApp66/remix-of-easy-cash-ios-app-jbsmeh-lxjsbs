
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { usePremiumEnforcement } from "@/hooks/usePremiumEnforcement";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLimitTracking } from "@/contexts/LimitTrackingContext";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

export default function AboScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { shouldRollback, setShouldRollback, lastAction, clearLastAction, setLastAction } = useLimitTracking();
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');

  // Menu state
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedSubForMenu, setSelectedSubForMenu] = useState<string | null>(null);

  // Edit modals
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditAmountModal, setShowEditAmountModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  // Calculate total amount from subscriptions
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const totalSubscriptions = subscriptions.length;

  // Premium enforcement hook
  const { canPerformAction, redirectToPremium } = usePremiumEnforcement({
    monthsCount: 0, // This will be passed from budget screen
    maxExpensesPerMonth: 0, // This will be passed from budget screen
    subscriptionsCount: totalSubscriptions,
    isPremium,
  });

  // Handle rollback when user closes premium modal after hitting limit
  useEffect(() => {
    if (shouldRollback && lastAction) {
      console.log('Rolling back last action in abo screen:', lastAction);
      
      if (lastAction.type === 'addSubscription' && lastAction.data?.subId) {
        // Remove the last added subscription
        setSubscriptions(prevSubs => prevSubs.filter(sub => sub.id !== lastAction.data.subId));
        console.log('Rolled back subscription addition:', lastAction.data.subId);
      }
      
      // Clear the rollback flag and last action
      clearLastAction();
    }
  }, [shouldRollback, lastAction]);

  // Sort subscriptions: pinned first
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleAddSubscription = () => {
    if (newSubName && newSubAmount) {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name: newSubName,
        amount: parseFloat(newSubAmount),
        isPinned: false,
      };
      
      // Check if user can add more subscriptions
      if (!canPerformAction('addSubscription')) {
        console.log('Cannot add more subscriptions - redirecting to premium');
        
        // First add the subscription
        setSubscriptions([...subscriptions, newSub]);
        
        // Track this action for potential rollback
        setLastAction({
          type: 'addSubscription',
          data: { subId: newSub.id },
          timestamp: Date.now(),
        });
        
        setNewSubName('');
        setNewSubAmount('');
        setShowAddModal(false);
        
        // Redirect to premium
        redirectToPremium();
        return;
      }

      // Normal add without limit
      setSubscriptions([...subscriptions, newSub]);
      setNewSubName('');
      setNewSubAmount('');
      setShowAddModal(false);
      console.log('Added subscription:', newSub);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    console.log('Deleted subscription:', id);
  };

  const handleLongPressSub = (subId: string) => {
    console.log('Long press on subscription:', subId);
    setSelectedSubForMenu(subId);
    setShowSubMenu(true);
  };

  const handlePinSub = () => {
    if (selectedSubForMenu) {
      setSubscriptions(subscriptions.map(sub =>
        sub.id === selectedSubForMenu
          ? { ...sub, isPinned: !sub.isPinned }
          : sub
      ));
      console.log('Toggled pin for subscription:', selectedSubForMenu);
    }
    setShowSubMenu(false);
    setSelectedSubForMenu(null);
  };

  const handleDuplicateSub = () => {
    if (selectedSubForMenu) {
      const subToDuplicate = subscriptions.find(sub => sub.id === selectedSubForMenu);
      if (subToDuplicate) {
        const duplicatedSub: Subscription = {
          ...subToDuplicate,
          id: Date.now().toString(),
          isPinned: false,
        };
        
        // Check if user can add more subscriptions
        if (!canPerformAction('addSubscription')) {
          console.log('Cannot duplicate subscription - redirecting to premium');
          
          // First add the duplicated subscription
          setSubscriptions([...subscriptions, duplicatedSub]);
          
          // Track this action for potential rollback
          setLastAction({
            type: 'addSubscription',
            data: { subId: duplicatedSub.id },
            timestamp: Date.now(),
          });
          
          setShowSubMenu(false);
          setSelectedSubForMenu(null);
          
          // Redirect to premium
          redirectToPremium();
          return;
        }

        // Normal duplicate without limit
        setSubscriptions([...subscriptions, duplicatedSub]);
        console.log('Duplicated subscription:', duplicatedSub);
      }
    }
    setShowSubMenu(false);
    setSelectedSubForMenu(null);
  };

  const handleRenameSub = () => {
    const sub = subscriptions.find(s => s.id === selectedSubForMenu);
    if (sub) {
      setEditName(sub.name);
      setShowSubMenu(false);
      setShowEditNameModal(true);
    }
  };

  const handleEditSubAmount = () => {
    const sub = subscriptions.find(s => s.id === selectedSubForMenu);
    if (sub) {
      setEditAmount(sub.amount.toString());
      setShowSubMenu(false);
      setShowEditAmountModal(true);
    }
  };

  const handleDeleteFromMenu = () => {
    if (selectedSubForMenu) {
      handleDeleteSubscription(selectedSubForMenu);
    }
    setShowSubMenu(false);
    setSelectedSubForMenu(null);
  };

  const handleSaveName = () => {
    if (selectedSubForMenu && editName) {
      setSubscriptions(subscriptions.map(sub =>
        sub.id === selectedSubForMenu
          ? { ...sub, name: editName }
          : sub
      ));
      console.log('Updated subscription name:', editName);
    }
    setShowEditNameModal(false);
    setSelectedSubForMenu(null);
    setEditName('');
  };

  const handleSaveAmount = () => {
    if (selectedSubForMenu && editAmount) {
      setSubscriptions(subscriptions.map(sub =>
        sub.id === selectedSubForMenu
          ? { ...sub, amount: parseFloat(editAmount) }
          : sub
      ));
      console.log('Updated subscription amount:', editAmount);
    }
    setShowEditAmountModal(false);
    setSelectedSubForMenu(null);
    setEditAmount('');
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
        {/* Header Card - matching Budget page first bubble */}
        <View style={styles.headerCard}>
          <View style={styles.headerLayout}>
            <View style={styles.headerLabelContainer}>
              <Text style={styles.headerLabel}>{t('abosCounter')}</Text>
            </View>
            <View style={styles.headerAmountContainer}>
              <Text style={styles.headerAmount}>{totalAmount.toLocaleString('de-DE')}</Text>
            </View>
          </View>
        </View>

        {/* Total Subscriptions - TOTAL text center-left */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t('total')}</Text>
          <Text style={styles.totalAmount}>{totalSubscriptions}</Text>
        </View>

        {/* Subscriptions List - name on left, amount on right */}
        <View style={styles.subscriptionsList}>
          {sortedSubscriptions.map((subscription, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.subscriptionItem,
                  subscription.isPinned && styles.pinnedSubscriptionItem,
                ]}
                onLongPress={() => handleLongPressSub(subscription.id)}
                delayLongPress={500}
                activeOpacity={0.7}
              >
                <View style={styles.subscriptionContent}>
                  <Text style={styles.subscriptionName}>{subscription.name}</Text>
                  <Text style={styles.subscriptionAmount}>{subscription.amount}</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Spacer for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button - Fixed to bottom right */}
      <TouchableOpacity 
        style={styles.floatingAddButton}
        onPress={() => {
          console.log('Add subscription button pressed');
          setShowAddModal(true);
        }}
        activeOpacity={0.8}
      >
        <IconSymbol 
          ios_icon_name="plus.circle.fill" 
          android_material_icon_name="add-circle" 
          size={56} 
          color={colors.green} 
        />
      </TouchableOpacity>

      {/* Add Subscription Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('addNewSubscription')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('subscriptionNamePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={newSubName}
              onChangeText={setNewSubName}
            />
            
            <TextInput
              style={styles.input}
              placeholder={t('subscriptionAmountPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={newSubAmount}
              onChangeText={setNewSubAmount}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleAddSubscription}
                activeOpacity={0.7}
              >
                <Text style={styles.addModalButtonText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Subscription Menu Modal */}
      <Modal
        visible={showSubMenu}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSubMenu(false);
          setSelectedSubForMenu(null);
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowSubMenu(false);
            setSelectedSubForMenu(null);
          }}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleRenameSub}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('rename')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleEditSubAmount}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('editAmount')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handlePinSub}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>
                {subscriptions.find(s => s.id === selectedSubForMenu)?.isPinned ? t('unpin') : t('pin')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleDuplicateSub}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('duplicate')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleDeleteFromMenu}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, { color: colors.red }]}>{t('delete')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.cancelMenuItem]}
              onPress={() => {
                setShowSubMenu(false);
                setSelectedSubForMenu(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={showEditNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('rename')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('name')}
              placeholderTextColor={colors.textSecondary}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditNameModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveName}
                activeOpacity={0.7}
              >
                <Text style={styles.addModalButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Amount Modal */}
      <Modal
        visible={showEditAmountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditAmountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editAmount')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('amountPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditAmountModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveAmount}
                activeOpacity={0.7}
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
  headerCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    minHeight: 140,
  },
  headerLayout: {
    flex: 1,
    position: 'relative',
  },
  headerLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerLabel: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
  },
  headerAmountContainer: {
    position: 'absolute',
    bottom: -8,
    right: 0,
  },
  headerAmount: {
    fontSize: 37,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 1,
  },
  totalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subscriptionsList: {
    gap: 12,
  },
  subscriptionItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    minHeight: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pinnedSubscriptionItem: {
    borderColor: colors.green,
  },
  subscriptionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 16,
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
