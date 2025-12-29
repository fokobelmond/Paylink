import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface SmsProvider {
  send(phone: string, message: string): Promise<boolean>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private resend: Resend | null = null;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
    }
  }

  /**
   * Envoyer un SMS
   * En production, intégrer avec un provider SMS camerounais
   * (ex: Orange SMS API, CM.com, Africa's Talking)
   */
  async sendSms(phone: string, message: string): Promise<boolean> {
    try {
      // Normaliser le numéro
      const normalizedPhone = this.normalizePhone(phone);

      this.logger.log(`[SMS] Envoi à ${normalizedPhone}: ${message}`);

      // En développement, logger seulement
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.debug(`[SMS SIMULÉ] ${normalizedPhone}: ${message}`);
        return true;
      }

      // En production, appeler l'API SMS
      // Exemple avec un provider hypothétique:
      /*
      const response = await fetch('https://sms-provider.cm/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.configService.get('SMS_API_KEY')}`,
        },
        body: JSON.stringify({
          to: normalizedPhone,
          message: message,
          sender: 'PayLink',
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS API error: ${response.status}`);
      }
      */

      return true;
    } catch (error) {
      this.logger.error(`Erreur envoi SMS: ${error.message}`);
      return false;
    }
  }

  /**
   * Envoyer un email
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      this.logger.log(`[EMAIL] Envoi à ${to}: ${subject}`);

      // En développement sans clé API, logger seulement
      if (!this.resend) {
        this.logger.debug(`[EMAIL SIMULÉ] ${to}: ${subject}`);
        return true;
      }

      await this.resend.emails.send({
        from: this.configService.get('EMAIL_FROM') || 'PayLink <paylink.now@gmail.com>',
        to,
        subject,
        html,
      });

      return true;
    } catch (error) {
      this.logger.error(`Erreur envoi email: ${error.message}`);
      return false;
    }
  }

  /**
   * Notification de paiement réussi au vendeur
   */
  async notifyPaymentReceived(
    sellerPhone: string,
    sellerEmail: string | null,
    amount: number,
    payerName: string | null,
    reference: string,
  ): Promise<void> {
    const payerInfo = payerName || 'un client';

    // SMS prioritaire
    await this.sendSms(
      sellerPhone,
      `PayLink: Vous avez reçu ${amount} FCFA de ${payerInfo}. Réf: ${reference}`,
    );

    // Email si disponible
    if (sellerEmail) {
      await this.sendEmail(
        sellerEmail,
        `Nouveau paiement reçu - ${amount} FCFA`,
        `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">💰 Nouveau paiement reçu !</h2>
            <p>Vous avez reçu un paiement de <strong>${amount} FCFA</strong> de ${payerInfo}.</p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Référence:</strong> ${reference}</p>
              <p style="margin: 8px 0 0;"><strong>Montant:</strong> ${amount} FCFA</p>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              Connectez-vous à votre dashboard PayLink pour plus de détails.
            </p>
          </div>
        `,
      );
    }
  }

  /**
   * Notification de paiement réussi au payeur
   */
  async notifyPaymentConfirmed(
    payerPhone: string,
    payerEmail: string | null,
    amount: number,
    reference: string,
    pageName: string,
  ): Promise<void> {
    // SMS
    await this.sendSms(
      payerPhone,
      `PayLink: Votre paiement de ${amount} FCFA pour "${pageName}" est confirmé. Réf: ${reference}`,
    );

    // Email si disponible
    if (payerEmail) {
      await this.sendEmail(
        payerEmail,
        `Confirmation de paiement - ${reference}`,
        `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">✅ Paiement confirmé</h2>
            <p>Votre paiement a été reçu avec succès.</p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Pour:</strong> ${pageName}</p>
              <p style="margin: 8px 0;"><strong>Montant:</strong> ${amount} FCFA</p>
              <p style="margin: 0;"><strong>Référence:</strong> ${reference}</p>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              Conservez ce reçu pour vos records.
            </p>
          </div>
        `,
      );
    }
  }

  /**
   * Email de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string,
  ): Promise<boolean> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://paylink.cm';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    return this.sendEmail(
      email,
      'Réinitialisation de votre mot de passe PayLink',
      `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">PayLink</h1>
          </div>
          
          <h2 style="color: #1e293b;">Bonjour ${firstName},</h2>
          
          <p style="color: #475569; line-height: 1.6;">
            Vous avez demandé la réinitialisation de votre mot de passe PayLink.
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; background: #2563eb; color: white; 
                      padding: 14px 28px; border-radius: 8px; text-decoration: none;
                      font-weight: 600;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette 
            réinitialisation, ignorez cet email.
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">
              ${resetLink}
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} PayLink. Tous droits réservés.<br>
            Douala, Cameroun
          </p>
        </div>
      `,
    );
  }

  /**
   * Email de bienvenue après inscription
   */
  async sendWelcomeEmail(
    email: string,
    firstName: string,
  ): Promise<boolean> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://paylink.cm';

    return this.sendEmail(
      email,
      'Bienvenue sur PayLink ! 🎉',
      `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">PayLink</h1>
          </div>
          
          <h2 style="color: #1e293b;">Bienvenue ${firstName} ! 🎉</h2>
          
          <p style="color: #475569; line-height: 1.6;">
            Félicitations ! Votre compte PayLink a été créé avec succès.
            Vous pouvez maintenant commencer à recevoir des paiements Mobile Money.
          </p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">🚀 Prochaines étapes</h3>
            <ol style="color: #475569; line-height: 1.8; padding-left: 20px;">
              <li>Créez votre première page de paiement</li>
              <li>Personnalisez-la avec vos services</li>
              <li>Partagez le lien avec vos clients</li>
              <li>Recevez des paiements instantanément !</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/dashboard" 
               style="display: inline-block; background: #2563eb; color: white; 
                      padding: 14px 28px; border-radius: 8px; text-decoration: none;
                      font-weight: 600;">
              Accéder à mon dashboard
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Besoin d'aide ? Contactez-nous à 
            <a href="mailto:paylink.now@gmail.com" style="color: #2563eb;">paylink.now@gmail.com</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} PayLink. Tous droits réservés.<br>
            Douala, Cameroun
          </p>
        </div>
      `,
    );
  }

  /**
   * Normaliser un numéro de téléphone camerounais
   */
  private normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\s+/g, '').replace('+', '');

    if (cleaned.startsWith('237')) {
      return `+${cleaned}`;
    }

    return `+237${cleaned}`;
  }
}


