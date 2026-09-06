import { describe, it, expect } from 'vitest';
import { calculatePagination, generateSecureToken, hashToken } from './index';

describe('API Utils - Pagination & Security', () => {
  describe('calculatePagination', () => {
    it('should calculate default pagination correctly', () => {
      const result = calculatePagination();
      expect(result).toEqual({ skip: 0, take: 20, page: 1, limit: 20 });
    });

    it('should calculate page 2 correctly', () => {
      const result = calculatePagination(2, 10);
      expect(result).toEqual({ skip: 10, take: 10, page: 2, limit: 10 });
    });

    it('should handle negative or invalid page gracefully', () => {
      const result = calculatePagination(-5, 0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.skip).toBe(0);
    });

    it('should cap limit at maxLimit', () => {
      const result = calculatePagination(1, 500, 50);
      expect(result.take).toBe(50);
      expect(result.limit).toBe(50);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate random hex string of expected length', () => {
      const token = generateSecureToken(16);
      expect(token).toBeTypeOf('string');
      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('hashToken', () => {
    it('should hash token deterministically with sha256', () => {
      const hash1 = hashToken('test-secret');
      const hash2 = hashToken('test-secret');
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // sha256 produces 64 hex characters
    });
  });
});
