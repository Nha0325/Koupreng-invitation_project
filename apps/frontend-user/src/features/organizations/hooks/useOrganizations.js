import { useCallback, useEffect, useState } from "react";
import { organizationService } from "../api/organizationApi";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await organizationService.listMine();
      setOrganizations(data || []);
    } catch (err) {
      setError(err?.message || "Could not load organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const createOrganization = async (name) => {
    setCreating(true);
    setError("");
    try {
      const newOrg = await organizationService.create(name);
      await loadOrganizations();
      return newOrg;
    } catch (err) {
      setError(err?.message || "Could not create organization");
      return null;
    } finally {
      setCreating(false);
    }
  };

  return {
    organizations,
    loading,
    error,
    creating,
    loadOrganizations,
    createOrganization,
  };
}
