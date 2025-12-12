/**
 * @jest-environment jsdom
 */
import { startListingRouter, readOnboardingPrefill } from '../onboarding';

describe('onboarding utils', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    // clear dataLayer
    (window as any).dataLayer = [];
  });

  describe('startListingRouter', () => {
    it('should navigate to onboarding and store prefill data', () => {
      const prefillData = { propertyId: '123', title: 'Test Property' };
      startListingRouter(mockRouter, prefillData, true);

      expect(sessionStorage.getItem('comfhutt:onboarding_prefill')).toBe(JSON.stringify(prefillData));
      expect(mockPush).toHaveBeenCalledWith('/owner-onboarding');
      
      const dataLayer = (window as any).dataLayer;
      expect(dataLayer).toContainEqual(expect.objectContaining({
        event: 'click_start_listing',
        propertyId: '123'
      }));
    });

    it('should redirect to login if not authenticated', () => {
        startListingRouter(mockRouter, undefined, false);

        expect(sessionStorage.getItem('comfhutt:onboarding_prefill_return')).toBe(JSON.stringify({ next: "/owner-onboarding" }));
        expect(mockPush).toHaveBeenCalledWith('/auth/signin?callbackUrl=/owner-onboarding');
    });

    it('should clear stale prefill data if none provided', () => {
        sessionStorage.setItem('comfhutt:onboarding_prefill', '{"stale":true}');
        startListingRouter(mockRouter, undefined, true);
        expect(sessionStorage.getItem('comfhutt:onboarding_prefill')).toBeNull();
    });
  });

  describe('readOnboardingPrefill', () => {
    it('should read and clear stored prefill data', () => {
      const data = { title: 'Test' };
      sessionStorage.setItem('comfhutt:onboarding_prefill', JSON.stringify(data));

      const result = readOnboardingPrefill();
      expect(result).toEqual(data);
      expect(sessionStorage.getItem('comfhutt:onboarding_prefill')).toBeNull();

      const dataLayer = (window as any).dataLayer;
      expect(dataLayer).toContainEqual(expect.objectContaining({
          event: 'onboarding_prefill_applied'
      }));
    });

    it('should return null if no data exists', () => {
        expect(readOnboardingPrefill()).toBeNull();
    });

    it('should handle malformed json gracefully', () => {
        sessionStorage.setItem('comfhutt:onboarding_prefill', 'invalid-json');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        expect(readOnboardingPrefill()).toBeNull();
        expect(sessionStorage.getItem('comfhutt:onboarding_prefill')).toBeNull();
        
        consoleSpy.mockRestore();
    });
  });
});