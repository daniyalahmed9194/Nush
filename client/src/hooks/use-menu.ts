import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { withApiBase } from "@/lib/api";

export function useMenu() {
  return useQuery({
    queryKey: [api.menu.list.path],
    queryFn: async () => {
      const res = await fetch(withApiBase(api.menu.list.path), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return api.menu.list.responses[200].parse(await res.json());
    },
  });
}
