import { useState, useCallback } from "react";

export function useCrud(initialItems = []) {
  const [items, setItems] = useState(initialItems);

  const create = useCallback((newItem) => {
    setItems((prev) => [...prev, newItem]);
  }, []);

  const update = useCallback((id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const findById = useCallback((id) => {
    return items.find((item) => item.id === id);
  }, [items]);

  return {
    items,
    setItems,
    create,
    update,
    remove,
    findById,
  };
}

export function useFilteredData(items, searchFields = [], searchTerm = "") {
  return items.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return searchFields.some((field) => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
}

export function useSortedData(items, sortField, sortDirection) {
  return [...items].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

export function usePaginatedData(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems: items.length,
  };
}
