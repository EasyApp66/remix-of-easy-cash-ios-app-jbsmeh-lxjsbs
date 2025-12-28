
import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  canClose?: boolean;
}

export function PremiumModal({ visible, onClose, canClose = true }: PremiumModalProps) {
  const { t } = useLanguage();

  const handleBuyPremium = (type: 'onetime' | 'monthly') => {
    console.log('Buy Premium:', type);
    onClose();
    // TODO: Implement payment processing
    Alert.alert(
      'Zahlung',
      `${type === 'onetime' ? 'Einmalige Zahlung' : 'Monatliches Abo'} wird verarbeitet...`,
      [{ text: 'OK' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={canClose ? onClose : undefined}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button - only show if canClose is true */}
          {canClose && (
            <Pressable 
              style={styles.closeButton}
              onPress={onClose}
            >
              <IconSymbol 
                ios_icon_name="xmark.circle.fill" 
                android_material_icon_name="close" 
                size={28} 
                color={colors.textSecondary} 
              />
            </Pressable>
          )}

          {/* Title */}
          <View style={styles.modalHeader}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={48} 
              color={colors.green} 
            />
            <Text style={styles.modalTitle}>{t('premiumTitle')}</Text>
          </View>

          {/* Description */}
          {!canClose && (
            <Text style={styles.warningText}>{t('premiumRequiredMessage')}</Text>
          )}
          <Text style={styles.modalDescription}>{t('premiumDescription')}</Text>

          {/* Features List */}
          <View style={styles.featuresList}>
            <Text style={styles.featureText}>{t('premiumFeature1')}</Text>
            <Text style={styles.featureText}>{t('premiumFeature2')}</Text>
            <Text style={styles.featureText}>{t('premiumFeature3')}</Text>
          </View>

          {/* Payment Options */}
          <View style={styles.paymentOptions}>
            {/* One-Time Payment */}
            <Pressable 
              style={({ pressed }) => [
                styles.paymentButton,
                pressed && styles.paymentButtonPressed
              ]}
              onPress={() => handleBuyPremium('onetime')}
            >
              <View style={styles.paymentButtonContent}>
                <Text style={styles.paymentButtonTitle}>{t('oneTimePayment')}</Text>
                <Text style={styles.paymentButtonPrice}>CHF 10.00</Text>
              </View>
              <View style={styles.payButton}>
                <Text style={styles.payButtonText}>{t('pay')}</Text>
              </View>
            </Pressable>

            {/* OR Separator */}
            <View style={styles.orSeparatorContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>{t('or')}</Text>
              <View style={styles.orLine} />
            </View>

            {/* Monthly Subscription */}
            <Pressable 
              style={({ pressed }) => [
                styles.paymentButton,
                pressed && styles.paymentButtonPressed
              ]}
              onPress={() => handleBuyPremium('monthly')}
            >
              <View style={styles.paymentButtonContent}>
                <Text style={styles.paymentButtonTitle}>{t('monthlySubscription')}</Text>
                <Text style={styles.paymentButtonPrice}>CHF 1.00{t('perMonth')}</Text>
              </View>
              <View style={styles.payButton}>
                <Text style={styles.payButtonText}>{t('pay')}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 15,
    color: colors.red,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.green,
  },
  paymentButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  paymentButtonContent: {
    marginBottom: 12,
  },
  paymentButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentButtonPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.green,
  },
  payButton: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  orSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey,
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginHorizontal: 12,
  },
});
