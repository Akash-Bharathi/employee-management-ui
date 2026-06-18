import { createContext, useContext, useState, useEffect, } from "react";
import { FaMagic, FaBolt, FaCrown, } from "react-icons/fa";

const SubscriptionContext =
  createContext();

const PLAN_CONFIG = {
  free: {
    name: "Free",

    maxEmployees: 10,
    maxAdmins: 1,

    analytics: false,
    auditLogs: false,
    export: false,

    icon: <FaMagic />,
  },

  professional: {
    name: "Professional",

    maxEmployees: 50,
    maxAdmins: 3,

    analytics: true,
    auditLogs: true,
    export: true,

    icon: <FaBolt />,
  },

  enterprise: {
    name: "Enterprise",

    maxEmployees: Infinity,
    maxAdmins: Infinity,

    analytics: true,
    auditLogs: true,
    export: true,

    icon: <FaCrown />,
  },
};

export function SubscriptionProvider({
  children,
}) {
  const [currentPlan, setCurrentPlan] =
    useState(
      localStorage.getItem(
        "subscriptionPlan"
      ) || "free"
    );
  useEffect(() => {
    localStorage.setItem(
      "subscriptionPlan",
      currentPlan
    );
  }, [currentPlan]);

  const value = {
    currentPlan,
    setCurrentPlan,

    planDetails:
      PLAN_CONFIG[currentPlan],

    plans: PLAN_CONFIG,
  };

  return (
    <SubscriptionContext.Provider
      value={value}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(
    SubscriptionContext
  );
}