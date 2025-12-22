
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

export default function AboScreen() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Netflix', amount: 15, isPinned: false },
    { id: '2', name: 'Disney +', amount: 13, isPinned: false },
    { id: '3', name: 'Apple Care', amount: 15, isPinned: false },
  ]);
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

  const totalAmount = 13556;
  const totalSubscriptions = subscriptions.length;

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
      setSubscriptions([...subscriptions, newSub]);
      setNewSubName('');
      setNewSubAmount('');
      setShowAddModal(false);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const handleLongPressSub = (subId: string) => {
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
        setSubscriptions([...subscriptions, duplicatedSub]);
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
        {/* Header Card - number moved to bottom right */}
        <View style={styles.headerCard}>
          <Text style={styles.headerLabel}>ABOS COUNTER</Text>
          <Text style={styles.headerAmount}>{totalAmount.toLocaleString('de-DE')}</Text>
        </View>

        {/* Total Subscriptions - TOTAL text center-left, number bottom right */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>{totalSubscriptions}</Text>
        </View>

        {/* Subscriptions List - numbers center-left aligned with text */}
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
        onPress={() => setShowAddModal(true)}
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
            <TouchableOpacity style={styles.menuItem} onPress={handleRenameSub}>
              <Text style={styles.menuItemText}>Namen anpassen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleEditSubAmount}>
              <Text style={styles.menuItemText}>Zahl anpassen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handlePinSub}>
              <Text style={styles.menuItemText}>
                {subscriptions.find(s => s.id === selectedSubForMenu)?.isPinned ? 'Fixierung aufheben' : 'Fixieren'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDuplicateSub}>
              <Text style={styles.menuItemText}>Duplizieren</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteFromMenu}>
              <Text style={[styles.menuItemText, { color: colors.red }]}>Löschen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.cancelMenuItem]}
              onPress={() => {
                setShowSubMenu(false);
                setSelectedSubForMenu(null);
              }}
            >
              <Text style={styles.menuItemText}>Abbrechen</Text>
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
            <Text style={styles.modalTitle}>Namen anpassen</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={colors.textSecondary}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditNameModal(false)}
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveName}
              >
                <Text style={styles.modalButtonText}>Speichern</Text>
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
            <Text style={styles.modalTitle}>Zahl anpassen</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Betrag"
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
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveAmount}
              >
                <Text style={styles.modalButtonText}>Speichern</Text>
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
    position: 'relative',
    minHeight: 120,
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    position: 'absolute',
    top: 24,
    left: 24,
  },
  headerAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    position: 'absolute',
    bottom: 24,
    right: 24,
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
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    position: 'absolute',
    top: '50%',
    left: 20,
    transform: [{ translateY: -8 }],
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    position: 'absolute',
    bottom: 20,
    right: 20,
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
    justifyContent: 'center',
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: '700',
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
