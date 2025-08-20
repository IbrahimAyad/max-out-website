"use client";

import { useState } from "react";
import { analytics } from "@/lib/analytics/analyticsClient";
import { emailService } from "@/lib/email/emailService";
import { recommendationService } from "@/lib/recommendations/recommendationService";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProducts } from "@/lib/hooks/useProducts";
import { formatPrice } from "@/lib/utils/format";

export default function DevTestPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "recommendations" | "email" | "webhooks" | "inventory">("analytics");
  const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications();
  const { customer } = useAuth();
  const { products } = useProducts();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return <div>Not available in production</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Development Testing Dashboard</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {["analytics", "recommendations", "email", "webhooks", "inventory"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === tab
                    ? "border-gold text-gold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "analytics" && <AnalyticsTestSection />}
          {activeTab === "recommendations" && <RecommendationsTestSection products={products} />}
          {activeTab === "email" && <EmailTestSection />}
          {activeTab === "webhooks" && <WebhookTestSection />}
          {activeTab === "inventory" && <InventoryTestSection />}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTestSection() {
  const { notifySuccess } = useNotifications();
  const testProduct = {
    id: "test-1",
    name: "Test Navy Suit",
    category: "suits",
    price: 89900,
  };

  const fireEvent = (eventName: string, eventFunction: () => void) => {
    eventFunction();
    notifySuccess("Analytics Event Fired", `${eventName} event sent successfully`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analytics Event Testing</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Page View Events</h3>
          <button
            onClick={() => fireEvent("Page View", () => {
              analytics.pageView({
                url: "/products/test",
                title: "Test Product Page",
                productId: "test-1",
                category: "suits",
              });
            })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Fire Product View
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Ecommerce Events</h3>
          <button
            onClick={() => fireEvent("Add to Cart", () => {
              analytics.addToCart({
                productId: testProduct.id,
                productName: testProduct.name,
                category: testProduct.category,
                price: testProduct.price,
                quantity: 1,
                size: "42R",
                source: "product_page",
              });
            })}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
          >
            Fire Add to Cart
          </button>

          <button
            onClick={() => fireEvent("Remove from Cart", () => {
              analytics.removeFromCart({
                productId: testProduct.id,
                productName: testProduct.name,
                price: testProduct.price,
                quantity: 1,
                size: "42R",
              });
            })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
          >
            Fire Remove from Cart
          </button>

          <button
            onClick={() => fireEvent("Begin Checkout", () => {
              analytics.beginCheckout(
                [{
                  id: testProduct.id,
                  name: testProduct.name,
                  category: testProduct.category,
                  price: testProduct.price,
                  quantity: 1,
                  size: "42R",
                }],
                testProduct.price
              );
            })}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Fire Begin Checkout
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Search & Filter Events</h3>
          <button
            onClick={() => fireEvent("Search", () => {
              analytics.search({
                query: "navy suit",
                resultsCount: 15,
                filters: { category: "suits", size: "42R" },
              });
            })}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mr-2"
          >
            Fire Search Event
          </button>

          <button
            onClick={() => fireEvent("Filter", () => {
              analytics.filterUsage({
                filterType: "category",
                value: "suits",
                resultsCount: 8,
              });
            })}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Fire Filter Event
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Conversion Events</h3>
          <button
            onClick={() => fireEvent("Purchase", () => {
              analytics.purchase(
                "TEST-ORDER-123",
                [{
                  id: testProduct.id,
                  name: testProduct.name,
                  category: testProduct.category,
                  price: testProduct.price,
                  quantity: 1,
                  size: "42R",
                }],
                testProduct.price,
                7866,
                0
              );
            })}
            className="bg-gold text-black px-4 py-2 rounded hover:bg-gold/90"
          >
            Fire Purchase Event
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            Open the browser console to see analytics events being tracked.
            Events are queued and sent in batches to /api/analytics/events
          </p>
        </div>
      </div>
    </div>
  );
}

function RecommendationsTestSection({ products }: { products: any[] }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testRecommendation = async (type: string) => {
    setLoading(true);
    try {
      const recs = await recommendationService.getRecommendations(type as any, {
        productId: products[0]?.id || "1",
        size: "42R",
        limit: 6,
      });
      setRecommendations(recs);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommendation Engine Testing</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => testRecommendation("customers_also_bought")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Customers Also Bought
          </button>
          <button
            onClick={() => testRecommendation("complete_the_look")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Complete the Look
          </button>
          <button
            onClick={() => testRecommendation("based_on_style")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Based on Style
          </button>
          <button
            onClick={() => testRecommendation("trending_in_size")}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Trending in Size
          </button>
          <button
            onClick={() => testRecommendation("similar_products")}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Similar Products
          </button>
        </div>

        {loading && <p className="text-gray-600">Loading recommendations...</p>}

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Recommendations:</h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{rec.product.name}</p>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(rec.product.price)}</p>
                      <p className="text-sm text-gray-600">Score: {rec.score.toFixed(2)}</p>
                    </div>
                  </div>
                  {rec.metadata && (
                    <p className="text-xs text-gray-500 mt-1">
                      Metadata: {JSON.stringify(rec.metadata)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmailTestSection() {
  const [selectedTemplate, setSelectedTemplate] = useState("order_confirmation");
  const [emailPreview, setEmailPreview] = useState("");

  const templates = {
    order_confirmation: {
      name: "Order Confirmation",
      data: {
        orderNumber: "KCT-TEST-123",
        customerName: "John Doe",
        items: [
          { name: "Navy Blue Suit", size: "42R", quantity: 1, price: 89900 },
          { name: "White Dress Shirt", size: "L", quantity: 2, price: 12900 },
        ],
        subtotal: 115700,
        tax: 10123,
        shipping: 0,
        total: 125823,
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "Detroit",
          state: "MI",
          zipCode: "48201",
        },
        estimatedDelivery: "Friday, December 20, 2024",
      },
    },
    shipping_update: {
      name: "Shipping Update",
      data: {
        orderNumber: "KCT-TEST-123",
        customerName: "John Doe",
        trackingNumber: "1Z999AA10123456784",
        carrier: "UPS",
        trackingUrl: "https://ups.com/track/1Z999AA10123456784",
        estimatedDelivery: "Friday, December 20, 2024",
        items: [
          { name: "Navy Blue Suit", quantity: 1 },
          { name: "White Dress Shirt", quantity: 2 },
        ],
      },
    },
    back_in_stock: {
      name: "Back in Stock",
      data: {
        customerName: "John",
        productName: "Premium Black Tuxedo",
        productImage: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80",
        productPrice: 129900,
        size: "42R",
        productUrl: "https://kctmenswear.com/products/3",
        unsubscribeUrl: "https://kctmenswear.com/unsubscribe",
      },
    },
    wedding_invitation: {
      name: "Wedding Invitation",
      data: {
        memberName: "Michael",
        groomName: "David Smith",
        weddingDate: "June 15, 2024",
        joinUrl: "https://kctmenswear.com/wedding/join?code=SMITH2024",
        weddingCode: "SMITH2024",
      },
    },
  };

  const loadTemplate = async (templateKey: string) => {
    // Import the template and generate HTML
    const templateData = templates[templateKey as keyof typeof templates];

    // In a real implementation, we'd render the template
    // For now, show the template data
    setEmailPreview(`
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${templateData.name} Preview</h2>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(templateData.data, null, 2)}
        </pre>
        <p style="margin-top: 20px; color: #666;">
          This would render the full HTML email template with the above data.
        </p>
      </div>
    `);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Email Template Testing</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              loadTemplate(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          >
            {Object.entries(templates).map(([key, template]) => (
              <option key={key} value={key}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => loadTemplate(selectedTemplate)}
          className="bg-gold text-black px-4 py-2 rounded hover:bg-gold/90"
        >
          Preview Template
        </button>

        {emailPreview && (
          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <p className="text-sm font-medium">Email Preview</p>
            </div>
            <div 
              className="p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: emailPreview }}
            />
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> In production, these templates would be fully rendered
            with proper HTML/CSS. Use Resend's preview feature for actual email testing.
          </p>
        </div>
      </div>
    </div>
  );
}

function WebhookTestSection() {
  const { notifySuccess, notifyError } = useNotifications();
  const [webhookLog, setWebhookLog] = useState<string[]>([]);

  const testWebhook = async (type: string) => {
    const webhookData = {
      products: {
        event: "product.updated",
        timestamp: new Date().toISOString(),
        data: {
          id: "test-1",
          sku: "TEST-SUIT-001",
          name: "Test Navy Suit",
          price: 89900,
          category: "suits",
          variants: [
            { size: "40R", stock: 5 },
            { size: "42R", stock: 8 },
          ],
        },
      },
      inventory: {
        event: "inventory.adjusted",
        timestamp: new Date().toISOString(),
        data: {
          sku: "TEST-SUIT-001",
          changes: [
            {
              size: "42R",
              previousStock: 10,
              currentStock: 8,
              reason: "Sale",
            },
          ],
        },
      },
      prices: {
        event: "price.updated",
        timestamp: new Date().toISOString(),
        data: {
          sku: "TEST-SUIT-001",
          productId: "test-1",
          changes: {
            previousPrice: 99900,
            currentPrice: 89900,
            reason: "Promotion",
          },
        },
      },
    };

    try {
      const response = await fetch(`/api/webhooks/admin/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-signature": process.env.NEXT_PUBLIC_ADMIN_WEBHOOK_SECRET || "test-secret",
        },
        body: JSON.stringify(webhookData[type as keyof typeof webhookData]),
      });

      const result = await response.json();
      const logEntry = `[${new Date().toLocaleTimeString()}] ${type.toUpperCase()} webhook: ${
        response.ok ? "SUCCESS" : "FAILED"
      } - ${JSON.stringify(result)}`;

      setWebhookLog((prev) => [logEntry, ...prev].slice(0, 10));

      if (response.ok) {
        notifySuccess("Webhook Test", `${type} webhook processed successfully`);
      } else {
        notifyError("Webhook Test Failed", `${type} webhook failed`);
      }
    } catch (error) {
      notifyError("Webhook Error", `Failed to test ${type} webhook`);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Webhook Testing</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => testWebhook("products")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Product Webhook
          </button>
          <button
            onClick={() => testWebhook("inventory")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Inventory Webhook
          </button>
          <button
            onClick={() => testWebhook("prices")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Test Price Webhook
          </button>
        </div>

        {webhookLog.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Webhook Log</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
              {webhookLog.map((log, index) => (
                <div key={index} className="text-xs">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InventoryTestSection() {
  const [inventoryUpdates, setInventoryUpdates] = useState<any[]>([]);
  const { notifyInfo } = useNotifications();

  const simulateInventoryUpdate = () => {
    const update = {
      sku: "TEST-SUIT-001",
      size: "42R",
      previousStock: 10,
      currentStock: Math.floor(Math.random() * 20),
      timestamp: new Date().toISOString(),
    };

    setInventoryUpdates((prev) => [update, ...prev].slice(0, 10));

    if (update.currentStock <= 5 && update.currentStock > 0) {
      notifyInfo("Low Stock Alert", `Size ${update.size} has only ${update.currentStock} items left`);
    } else if (update.currentStock === 0) {
      notifyInfo("Out of Stock", `Size ${update.size} is now out of stock`);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Real-time Inventory Updates</h2>
      <div className="space-y-4">
        <button
          onClick={simulateInventoryUpdate}
          className="bg-gold text-black px-4 py-2 rounded hover:bg-gold/90"
        >
          Simulate Inventory Update
        </button>

        <div className="p-4 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-800">
            In production, inventory updates would come from webhooks and SSE connections.
            Click the button to simulate real-time updates.
          </p>
        </div>

        {inventoryUpdates.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Inventory Update Log</h3>
            <div className="space-y-2">
              {inventoryUpdates.map((update, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    update.currentStock === 0
                      ? "bg-red-50 border border-red-200"
                      : update.currentStock <= 5
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">SKU: {update.sku} - Size: {update.size}</p>
                      <p className="text-sm">
                        Stock: {update.previousStock} → {update.currentStock}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}