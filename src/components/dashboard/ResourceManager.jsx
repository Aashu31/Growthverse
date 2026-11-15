import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../common/Button";
import { Modal, ConfirmDialog } from "../common/Modal";
import { Loader } from "../common/Loader";
import { useData } from "../../context/DataContext";
import { ApiError } from "../../api/client";
import { formatDate } from "../../utils/formatters";
import { StatusBadge } from "./StatusBadge";

function defaultFor(field) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === "checkbox") return true;
  return "";
}

function displayValue(value, column) {
  if (column.render) return column.render(value);
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (column.type === "date") return formatDate(value);
  if (column.type === "currency") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: column.currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }
  if (column.type === "status") return <StatusBadge value={value} />;
  return String(value);
}

/**
 * Reusable authenticated CRUD table used by the dashboard pages.
 * Every mutation goes through the DataContext -> API client -> backend.
 */
export function ResourceManager({
  resource,
  title,
  description,
  columns,
  fields,
  createLabel = "Add",
  emptyMessage = "No records found.",
  searchPlaceholder = "Search...",
  searchKeys,
  filterField,
  filterOptions,
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
  canManage = true,
  modalSize = "2xl",
  children,
}) {
  const { [resource]: rows, loading, errors, createEntity, updateEntity, deleteEntity, refreshResource } = useData();
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const isLoading = Boolean(loading?.[resource]);
  const loadError = errors?.[resource];

  const keys = useMemo(
    () => searchKeys || columns.map((column) => column.key),
    [searchKeys, columns]
  );

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rows || []).filter((row) => {
      const matchesSearch =
        !term ||
        keys.some((key) => {
          const value = key.split(".").reduce((accumulator, part) => accumulator?.[part], row);
          return String(value ?? "").toLowerCase().includes(term);
        });
      const matchesFilter =
        !filterField || filterValue === "all" || String(row[filterField]) === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [rows, search, keys, filterField, filterValue]);

  const resetForm = () => {
    const next = {};
    for (const field of fields) next[field.name] = defaultFor(field);
    setForm(next);
    setFieldErrors({});
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    const next = {};
    for (const field of fields) {
      const value = row[field.name];
      next[field.name] =
        field.fromRow !== undefined
          ? field.fromRow(row)
          : value === null || value === undefined
            ? defaultFor(field)
            : field.type === "tags" && Array.isArray(value)
              ? value.join(", ")
              : value;
    }
    setForm(next);
    setFieldErrors({});
    setFormError("");
    setEditingId(row.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const validate = () => {
    const next = {};
    for (const field of fields) {
      if (editingId && field.createOnly) continue;
      const value = form[field.name];
      if (field.required && (value === undefined || value === null || String(value).trim() === "")) {
        next[field.name] = `${field.label} is required.`;
      }
    }
    return next;
  };

  const buildPayload = () => {
    const payload = {};
    for (const field of fields) {
      if (editingId && field.createOnly) continue;
      let value = form[field.name];

      if (field.type === "checkbox") {
        payload[field.name] = Boolean(value);
        continue;
      }
      if (field.type === "number") {
        if (value === "" || value === null || value === undefined) continue;
        payload[field.name] = Number(value);
        continue;
      }
      if (field.type === "date") {
        if (!value) continue;
        payload[field.name] = new Date(value).toISOString();
        continue;
      }
      if (field.type === "tags") {
        payload[field.name] = String(value || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        continue;
      }
      if (field.type === "lines") {
        payload[field.name] = String(value || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        continue;
      }
      if (field.omitEmpty && (value === "" || value === null || value === undefined)) continue;
      payload[field.name] = field.toPayload ? field.toPayload(value, form) : value;
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      const payload = buildPayload();
      if (editingId) await updateEntity(resource, editingId, payload);
      else await createEntity(resource, payload);
      setIsModalOpen(false);
      setActionError("");
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors());
        setFormError(error.message || "The record could not be saved.");
      } else {
        setFormError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    setActionError("");
    try {
      await deleteEntity(resource, confirmId);
      setConfirmId(null);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "The record could not be deleted.");
      setConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderField = (field) => {
    const value = form[field.name] ?? "";
    const commonClass =
      "w-full px-4 py-3 rounded-xl border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-champagne/40";

    if (field.type === "checkbox") {
      return (
        <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form[field.name])}
            onChange={(event) => setForm((previous) => ({ ...previous, [field.name]: event.target.checked }))}
            className="h-4 w-4 rounded border-gv-border text-champagne focus:ring-champagne"
          />
          <span className="text-sm text-dark-text dark:text-light-text">{field.label}</span>
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <select
          id={field.name}
          value={value}
          onChange={(event) => setForm((previous) => ({ ...previous, [field.name]: event.target.value }))}
          className={commonClass}
          required={field.required}
        >
          {!field.required && <option value="">{field.placeholder || "None"}</option>}
          {(field.options || []).map((option) => {
            const optionValue = typeof option === "object" ? option.value : option;
            const optionLabel = typeof option === "object" ? option.label : option;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          id={field.name}
          value={value}
          onChange={(event) => setForm((previous) => ({ ...previous, [field.name]: event.target.value }))}
          rows={field.rows || 4}
          placeholder={field.placeholder}
          required={field.required}
          className={commonClass}
        />
      );
    }

    return (
      <input
        id={field.name}
        type={field.type === "tags" || field.type === "lines" ? "text" : field.type || "text"}
        value={value}
        onChange={(event) => setForm((previous) => ({ ...previous, [field.name]: event.target.value }))}
        placeholder={field.placeholder}
        required={field.required}
        min={field.min}
        step={field.step}
        className={commonClass}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h2 text-dark-text dark:text-light-text">{title}</h2>
          {description && <p className="text-warm-grey dark:text-dark-mocha/60 mt-1">{description}</p>}
        </div>
        {allowCreate && canManage && (
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> {createLabel}
          </Button>
        )}
      </div>

      {children}

      {actionError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {loadError && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {loadError}
          </span>
          <Button variant="outline" size="sm" onClick={() => refreshResource(resource)}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-grey" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-champagne/40"
            aria-label={searchPlaceholder}
          />
        </div>
        {filterField && filterOptions && (
          <select
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="px-4 py-3 rounded-xl border border-gv-border dark:border-gv-border-dark bg-white dark:bg-deep-coffee text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-champagne/40"
            aria-label="Filter records"
          >
            <option value="all">All</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto bg-white dark:bg-deep-coffee rounded-2xl border border-gv-border dark:border-gv-border-dark">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gv-border dark:border-gv-border-dark bg-sand-beige/50 dark:bg-deep-coffee/50">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60 whitespace-nowrap">
                  {column.label}
                </th>
              ))}
              {(allowEdit || allowDelete) && (
                <th className="px-4 py-3 font-medium text-warm-grey dark:text-dark-mocha/60 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading && filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12">
                  <Loader text="Loading records..." />
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-warm-grey dark:text-dark-mocha/60">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-gv-border dark:border-gv-border-dark last:border-0 hover:bg-sand-beige/50 dark:hover:bg-deep-coffee/50 transition-colors">
                  {columns.map((column) => {
                    const value = column.key.split(".").reduce((accumulator, part) => accumulator?.[part], row);
                    return (
                      <td key={column.key} className="px-4 py-3 text-warm-grey dark:text-dark-mocha/60 align-top">
                        {column.rowRender ? column.rowRender(row) : displayValue(value, column)}
                      </td>
                    );
                  })}
                  {(allowEdit || allowDelete) && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {allowEdit && canManage && (
                        <Button variant="ghost" size="sm" onClick={() => openEdit(row)} aria-label="Edit record">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {allowDelete && canManage && (
                        <Button variant="outline" size="sm" onClick={() => setConfirmId(row.id)} aria-label="Delete record">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? `Edit ${title.replace(/ Management$/, "")}` : createLabel}
        size={modalSize}
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {formError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.span === "full" ? "md:col-span-2" : ""}>
                {field.type !== "checkbox" && (
                  <label htmlFor={field.name} className="block text-sm font-medium text-dark-text dark:text-light-text mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                {renderField(field)}
                {field.help && <p className="mt-1 text-xs text-warm-grey dark:text-dark-mocha/60">{field.help}</p>}
                {fieldErrors[field.name] && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gv-border dark:border-gv-border-dark">
            <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              {editingId ? "Save changes" : createLabel}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(confirmId)}
        onConfirm={handleDelete}
        onCancel={() => (isDeleting ? null : setConfirmId(null))}
        title="Delete record"
        message="This permanently deletes the record. This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
      />
    </div>
  );
}

export default ResourceManager;
