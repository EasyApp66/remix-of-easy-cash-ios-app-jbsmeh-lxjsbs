
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
}

const MONTHS = [
  'JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI',
  'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER'
];

export default function BudgetScreen() {
  const [selectedMonth, setSelectedMonth] = useState('DEZEMBER');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', name: 'SPAREN', amount: 1500 },
    { id: '2', name: 'KRANKEN KASSE', amount: 450 },
    { id: '3', name: 'ESSEN', amount: 650 },
    { id: '4', name: 'MIETE', amount: 2500 },
    { id: '5', name: 'SPAREN', amount: 1146 },
    { id: '6', name: 'SPAREN', amount: 1146 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const accountBalance = 13556;
  const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = accountBalance - totalExpenses;

  const handleAddItem = () => {
    if (newItemName && newItemAmount) {
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        name: newItemName.toUpperCase(),
        amount: parseFloat(newItemAmount),
      };
      setBudgetItems([...budgetItems, newItem]);
      setNewItemName('');
      setNewItemAmount('');
      setShowAddModal(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const cycleMonth = () => {
    const currentIndex = MONTHS.indexOf(selectedMonth);
    const nextIndex = (currentIndex + 1) % MONTHS.length;
    setSelectedMonth(MONTHS[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>KONTOSTAND</Text>
          <View style={styles.balanceIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
          </View>
          <Text style={styles.balanceAmount}>{accountBalance.toLocaleString('de-DE')}</Text>
        </View>

        {/* Total and Remaining */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL</Text>
            <Text style={styles.summaryAmount}>{totalExpenses.toLocaleString('de-DE')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>BLEIBT</Text>
            <Text style={[styles.summaryAmount, styles.remainingAmount]}>{remaining.toLocaleString('de-DE')}</Text>
          </View>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol 
              ios_icon_name="plus.circle.fill" 
              android_material_icon_name="add-circle" 
              size={24} 
              color={colors.green} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.monthButton} onPress={cycleMonth}>
            <Text style={styles.monthText}>{selectedMonth}</Text>
            <IconSymbol 
              ios_icon_name="xmark.circle.fill" 
              android_material_icon_name="cancel" 
              size={20} 
              color={colors.red} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.monthButton}>
            <Text style={styles.monthText}>JANUAR</Text>
            <IconSymbol 
              ios_icon_name="xmark.circle.fill" 
              android_material_icon_name="cancel" 
              size={20} 
              color={colors.red} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exampleButton}>
            <Text style={styles.exampleText}>BEISPIEL</Text>
          </TouchableOpacity>
        </View>

        {/* Budget Items Grid */}
        <View style={styles.budgetGrid}>
          {budgetItems.map((item, index) => (
            <View key={index} style={styles.budgetItem}>
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
              <Text style={styles.budgetItemAmount}>{item.amount.toLocaleString('de-DE')}</Text>
            </View>
          ))}
        </View>

        {/* Add Button */}
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
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Neues Budget hinzufügen</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name (z.B. ESSEN)"
              placeholderTextColor={colors.textSecondary}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Betrag"
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
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleAddItem}
              >
                <Text style={styles.modalButtonText}>Hinzufügen</Text>
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
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  balanceIndicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grey,
  },
  activeIndicator: {
    backgroundColor: colors.green,
  },
  balanceAmount: {
    fontSize: 48,
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
  monthSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  addButton: {
    padding: 8,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  exampleButton: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  exampleText: {
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
    minHeight: 140,
    justifyContent: 'space-between',
  },
  budgetItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  budgetItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  budgetItemAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
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
});
