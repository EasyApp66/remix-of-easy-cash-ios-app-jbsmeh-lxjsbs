
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import SnowAnimation from "@/components/SnowAnimation";
import { usePremiumEnforcement } from "@/hooks/usePremiumEnforcement";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLimitTracking } from "@/contexts/LimitTrackingContext";
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

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
      
      // Check if adding this subscription would exceed the limit
      if (!canPerformAction('addSubscription')) {
        console.log('Subscription limit reached, redirecting to premium');
        
        // Track this action for potential rollback
        setLastAction({
          type: 'addSubscription',
          data: { subId: newSub.id },
          timestamp: Date.now(),
        });
        
        // Add the subscription first
        setSubscriptions([...subscriptions, newSub]);
        
        setNewSubName('');
        setNewSubAmount('');
        setShowAddModal(false);
        
        // Then redirect to premium
        redirectToPremium();
        return;
      }
      
      // If within limits, just add the subscription
      setSubscriptions([...subscriptions, newSub]);
      setNewSubName('');
      setNewSubAmount('');
      setShowAddModal(false);
      console.log('Added subscription within limits:', newSub);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    console.log('Deleted subscription:', id);
  };

  const handleTogglePin = (id: string) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === id
        ? { ...sub, isPinned: !sub.isPinned }
        : sub
    ));
    console.log('Toggled pin for subscription:', id);
  };

  const handleLongPressSub = (subId: string) => {
    console.log('Long press on subscription:', subId);
    setSelectedSubForMenu(subId);
    setShowSubMenu(true);
  };

  const handlePinSub = () => {
    if (selectedSubForMenu) {
      handleTogglePin(selectedSubForMenu);
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
        
        // Check if duplicating this subscription would exceed the limit
        if (!canPerformAction('addSubscription')) {
          console.log('Subscription limit reached when duplicating, redirecting to premium');
          
          // Track this action for potential rollback
          setLastAction({
            type: 'addSubscription',
            data: { subId: duplicatedSub.id },
            timestamp: Date.now(),
          });
          
          // Add the duplicated subscription first
          setSubscriptions([...subscriptions, duplicatedSub]);
          
          // Then redirect to premium
          redirectToPremium();
          setShowSubMenu(false);
          setSelectedSubForMenu(null);
          return;
        }
        
        // If within limits, just duplicate the subscription
        setSubscriptions([...subscriptions, duplicatedSub]);
        console.log('Duplicated subscription within limits:', duplicatedSub);
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

  // Render left action (Pin) - swipe from left - ONLY ICON, NO TEXT
  const renderLeftActions = (subscription: Subscription) => {
    return (
      <View style={styles.leftActionContainer}>
        <View style={styles.leftAction}>
          <IconSymbol
            ios_icon_name={subscription.isPinned ? "pin.slash.fill" : "pin.fill"}
            android_material_icon_name={subscription.isPinned ? "push-pin" : "push-pin"}
            size={28}
            color="#000000"
          />
        </View>
      </View>
    );
  };

  // Render right action (Delete) - swipe from right - ONLY ICON, NO TEXT
  const renderRightActions = () => {
    return (
      <View style={styles.rightActionContainer}>
        <View style={styles.rightAction}>
          <IconSymbol
            ios_icon_name="trash.fill"
            android_material_icon_name="delete"
            size={28}
            color="#000000"
          />
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Snow animation background */}
      <SnowAnimation />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card - Glass Effect */}
        <View style={styles.headerCardWrapper}>
          <BlurView intensity={20} tint="dark" style={styles.headerCard}>
            <View style={styles.headerLayout}>
              <View style={styles.headerLabelContainer}>
                <Text style={styles.headerLabel}>{t('abosCounter')}</Text>
              </View>
              <View style={styles.headerAmountContainer}>
                <Text style={styles.headerAmount}>{totalAmount.toLocaleString('de-DE')}</Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Total Subscriptions - Glass Effect */}
        <View style={styles.totalCardWrapper}>
          <BlurView intensity={20} tint="dark" style={styles.totalCard}>
            <Text style={styles.totalLabel}>{t('total')}</Text>
            <Text style={styles.totalAmount}>{totalSubscriptions}</Text>
          </BlurView>
        </View>

        {/* Subscriptions List - Glass Effect with Swipe Actions */}
        <View style={styles.subscriptionsList}>
          {sortedSubscriptions.map((subscription, index) => (
            <React.Fragment key={index}>
              <Swipeable
                renderLeftActions={() => renderLeftActions(subscription)}
                renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => {
                  console.log('Swipe opened:', direction, subscription.id);
                  if (direction === 'left') {
                    // Swipe from left = Pin/Unpin
                    handleTogglePin(subscription.id);
                  } else if (direction === 'right') {
                    // Swipe from right = Delete
                    handleDeleteSubscription(subscription.id);
                  }
                }}
                overshootLeft={false}
                overshootRight={false}
                friction={1}
                leftThreshold={80}
                rightThreshold={80}
                enableTrackpadTwoFingerGesture
                containerStyle={styles.swipeableContainer}
              >
                <TouchableOpacity
                  style={styles.subscriptionItemWrapper}
                  onLongPress={() => handleLongPressSub(subscription.id)}
                  delayLongPress={500}
                  activeOpacity={0.7}
                >
                  <BlurView 
                    intensity={20} 
                    tint="dark" 
                    style={[
                      styles.subscriptionItem,
                      subscription.isPinned && styles.pinnedSubscriptionItem,
                    ]}
                  >
                    <View style={styles.subscriptionContent}>
                      <Text 
                        style={styles.subscriptionName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {subscription.name}
                      </Text>
                      <Text style={styles.subscriptionAmount}>{subscription.amount}</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </Swipeable>
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
              maxLength={50}
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
              maxLength={50}
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
    </GestureHandlerRootView>
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
  headerCardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    minHeight: 140,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
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
  totalCardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  totalCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
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
  swipeableContainer: {
    marginBottom: 0,
  },
  subscriptionItemWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  subscriptionItem: {
    borderRadius: 20,
    padding: 20,
    minHeight: 80,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
  },
  pinnedSubscriptionItem: {
    borderColor: colors.green,
  },
  subscriptionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 0,
    minWidth: 50,
    textAlign: 'right',
  },
  leftActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  leftAction: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  rightActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  rightAction: {
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
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
