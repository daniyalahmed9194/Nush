import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderRequest, OrderWithDetails } from "@shared/schema";

export function useOrders() {
  return useQuery<OrderWithDetails[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderRequest) => {
      console.log("Sending order data:", orderData);
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status);
      console.log("Response content-type:", response.headers.get("content-type"));
      
      if (!response.ok) {
        const responseText = await response.text();
        console.log("Error response text:", responseText);
        
        let error;
        try {
          error = JSON.parse(responseText);
        } catch {
          throw new Error(`Server error: ${responseText.substring(0, 100)}`);
        }
        throw new Error(error.message || "Failed to create order");
      }

      const result = await response.json();
      console.log("Success response:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
