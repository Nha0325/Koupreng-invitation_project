import { useMemo, useState } from "react";

export function useGuestFilters(guests = []) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const term = search.trim().toLowerCase();
      const name = (guest.name || "").toLowerCase();
      const phone = (guest.phone || "").toLowerCase();
      const group = (guest.group || "").toLowerCase();

      const matchesSearch =
        !term || name.includes(term) || phone.includes(term) || group.includes(term);
      const matchesGroup = !groupFilter || guest.group === groupFilter;
      const matchesCategory = !categoryFilter || guest.category === categoryFilter;

      return matchesSearch && matchesGroup && matchesCategory;
    });
  }, [categoryFilter, groupFilter, guests, search]);

  return {
    search,
    setSearch,
    groupFilter,
    setGroupFilter,
    categoryFilter,
    setCategoryFilter,
    filteredGuests,
  };
}
