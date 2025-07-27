import { CampaignType } from "@/app/enums/campaign-type";
import { CampaignWizardFormData } from "@/components/dashboard/advertiser/CreateCampaignWizard";

/**
 * Calculate the estimated maximum budget for a campaign based on form data
 */
export function calculateEstimatedBudget(
  formData: CampaignWizardFormData
): number {
  if (!formData.type) {
    return 0;
  }

  switch (formData.type) {
    case CampaignType.VISIBILITY:
      // For visibility campaigns: CPV * Max Views
      if (formData.cpv && formData.maxViews) {
        return formData.cpv * formData.maxViews;
      }
      return 0;

    case CampaignType.CONSULTANT:
      // For consultant campaigns: use max budget
      return formData.maxBudget || 0;

    case CampaignType.SELLER:
      // For seller campaigns: use max budget
      return formData.sellerMaxBudget || 0;

    case CampaignType.SALESMAN:
      // For salesman campaigns, it's harder to estimate since it's commission-based
      // We'll use a conservative estimate or ask the user to provide an estimate
      // For now, let's assume a reasonable default based on commission structure
      if (formData.commissionPerSale) {
        // Estimate: assume 100 sales as a reasonable maximum estimate
        // This can be made configurable or user-inputted later
        const estimatedMaxSales = 100;
        return formData.commissionPerSale * estimatedMaxSales;
      }
      return 0;

    default:
      return 0;
  }
}

/**
 * Get a user-friendly description of how the budget is calculated
 */
export function getBudgetCalculationDescription(
  formData: CampaignWizardFormData
): string {
  if (!formData.type) {
    return "Budget calculation not available";
  }

  switch (formData.type) {
    case CampaignType.VISIBILITY:
      if (formData.cpv && formData.maxViews) {
        return `${formData.cpv.toFixed(
          2
        )} per view × ${formData.maxViews.toLocaleString()} max views`;
      }
      return "Cost per view × Maximum views";

    case CampaignType.CONSULTANT:
      return "Maximum budget as specified";

    case CampaignType.SELLER:
      return "Maximum budget as specified";

    case CampaignType.SALESMAN:
      if (formData.commissionPerSale) {
        return `$${formData.commissionPerSale} commission × estimated 100 sales (conservative estimate)`;
      }
      return "Commission per sale × estimated sales volume";

    default:
      return "Budget calculation not available";
  }
}

/**
 * Validate if the campaign form has enough data to calculate budget
 */
export function canCalculateBudget(formData: CampaignWizardFormData): boolean {
  if (!formData.type) {
    return false;
  }

  switch (formData.type) {
    case CampaignType.VISIBILITY:
      return !!(formData.cpv && formData.maxViews);

    case CampaignType.CONSULTANT:
      return !!formData.maxBudget;

    case CampaignType.SELLER:
      return !!formData.sellerMaxBudget;

    case CampaignType.SALESMAN:
      return !!formData.commissionPerSale;

    default:
      return false;
  }
}
