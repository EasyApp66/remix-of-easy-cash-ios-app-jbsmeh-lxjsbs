
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

interface Subscription {
  id: string;
  name: string;
  amount: number;
}

export default function AboScreen() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Netflix', amount: 15 },
    { id: '2', name: 'Disney +', amount: 13 },
    { id: '3', name: 'Apple Care', amount: 15 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');

  const totalAmount = 13556;
  const totalSubscriptions = subscriptions.length;

  const handleAddSubscription = () => {
    if (newSubName && newSubAmount) {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name: newSubName,
        amount: parseFloat(newSubAmount),
      };
      setSubscriptions([...subscriptions, newSub]);
      setNewSubName('');
      setNewSubAmount('');
      setShowAddModal(false);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerLabel}>ABOS COUNTER</Text>
          <View style={styles.balanceIndicators}>
            <View style={styles.indicator} />
            <View style={[styles.indicator, styles.activeIndicator]} />
          </View>
          <Text style={styles.headerAmount}>{totalAmount.toLocaleString('de-DE')}</Text>
        </View>

        {/* Total Subscriptions */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>{totalSubscriptions}</Text>
        </View>

        {/* Subscriptions List */}
        <View style={styles.subscriptionsList}>
          {subscriptions.map((subscription, index) => (
            <View key={index} style={styles.subscriptionItem}>
              <Text style={styles.subscriptionName}>{subscription.name}</Text>
              <Text style={styles.subscriptionAmount}>{subscription.amount}</Text>
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

      {/* Add Subscription Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Neues Abo hinzufügen</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name (z.B. Spotify)"
              placeholderTextColor={colors.textSecondary}
              value={newSubName}
              onChangeText={setNewSubName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Betrag pro Monat"
              placeholderTextColor={colors.textSecondary}
              value={newSubAmount}
              onChangeText={setNewSubAmount}
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
                onPress={handleAddSubscription}
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
  headerCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  headerLabel: {
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
  headerAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
  },
  totalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: '700',
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
