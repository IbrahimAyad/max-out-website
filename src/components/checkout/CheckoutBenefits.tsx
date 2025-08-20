import { Shield, Truck, RefreshCw, Award } from "lucide-react";

export function CheckoutBenefits() {
  const benefits = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "256-bit SSL encryption",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "2-5 business days",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Guaranteed satisfaction",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;
        return (
          <div
            key={benefit.title}
            className="text-center p-4 bg-gray-50 rounded-lg"
          >
            <Icon className="w-8 h-8 text-gold mx-auto mb-2" />
            <h3 className="font-semibold text-sm">{benefit.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{benefit.description}</p>
          </div>
        );
      })}
    </div>
  );
}