export function getCurrentSubscription() {
  return Promise.resolve({
    plan: "free",
    features: {
      analytics: false,
      auditLogs: false,
      export: false,
    },
  });
}

export function updateSubscriptionPlan(plan) {
  return Promise.resolve({
    success: true,
    plan,
  });
}
