import * as crypto from 'crypto';

/**
 * Generates a secure 6-digit OTP.
 * @returns {string} A 6-digit OTP as a string.
 */
export const generateSecureOTP = (): string => {
  // Generate a random 3-byte buffer (3 bytes = 24 bits, sufficient for a 6-digit number)
  const buffer = crypto.randomBytes(3);

  // Convert the buffer to a number and restrict it to 6 digits using modulo
  const otp = buffer.readUIntBE(0, 3) % 1000000;

  // Pad the OTP with leading zeros if necessary to ensure it's 6 digits
  return otp.toString().padStart(6, '0');
};
