import Link from "next/link";
import ContactInquiryActions from "@/components/admin/ContactInquiryActions";
import {
  buildContactInquiryWhere,
  CONTACT_INQUIRY_STATUS_VALUES,
  contactInquiryListQueryString,
  normalizeCalendarDateParam,
  parseContactInquiryStatusParam,
} from "@/lib/admin-contact-inquiry-filters";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 100;

function getStatusPillClass(status: string) {
  const upper = status.toUpperCase();
  if (upper === "CLOSED") return "admin-status-pill--closed";
  if (upper === "REVIEWED") return "admin-status-pill--reviewed";
  if (upper === "DELIVERY_FAILED") return "admin-status-pill--delivery_failed";
  if (upper === "EMAILED") return "admin-status-pill--emailed";
  return "admin-status-pill--new";
}

function previewText(input: string, max = 200) {
  const t = input.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}...`;
}

export default async function AdminContactInquiriesPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string; page?: string; from?: string; to?: string };
}) {
  const q = (searchParams?.q || "").trim();
  const status = parseContactInquiryStatusParam(searchParams?.status);
  const from = normalizeCalendarDateParam(searchParams?.from);
  const to = normalizeCalendarDateParam(searchParams?.to);
  const parsedPage = Number.parseInt((searchParams?.page || "1").trim(), 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const where = buildContactInquiryWhere({ q, status: searchParams?.status, from, to });

  type ContactInquiryRow = {
    id: string;
    createdAt: Date;
    name: string;
    email: string;
    phone: string;
    inquiryType: string;
    subject: string;
    message: string;
    status: string;
    emailedAt: Date | null;
    emailError: string | null;
  };

  const total = await prisma.contactInquiry.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const rows = await prisma.contactInquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
      phone: true,
      inquiryType: true,
      subject: true,
      message: true,
      status: true,
      emailedAt: true,
      emailError: true,
    },
  });
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const buildPageHref = (nextPage: number) => {
    const qs = contactInquiryListQueryString({ q, status, from, to, page: nextPage });
    return qs ? `/admin/contact-inquiries?${qs}` : "/admin/contact-inquiries";
  };

  const exportQs = contactInquiryListQueryString({ q, status, from, to });
  const exportHref = exportQs
    ? `/api/admin/contact-inquiries/export?${exportQs}`
    : "/api/admin/contact-inquiries/export";

  const newOnlyQs = contactInquiryListQueryString({ q, status: "NEW", from, to });
  const newOnlyHref = newOnlyQs ? `/admin/contact-inquiries?${newOnlyQs}` : "/admin/contact-inquiries?status=NEW";

  return (
    <main>
      <p className="admin-backlink">
        <Link href="/admin/">← Admin home</Link>
      </p>
      <h1>Contact inquiries</h1>
      <p className="admin-muted">
        New messages from the public contact form are stored here. Showing up to {PAGE_SIZE} per page. Received dates
        filter uses UTC calendar days.
      </p>

      <form method="GET" className="admin-data-table__toolbar" style={{ marginBottom: 12 }}>
        <input type="hidden" name="page" value="1" />
        <div className="admin-data-table__toolbar-main">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, subject, or message"
            className="admin-data-table__search"
          />
          <div className="admin-inline-actions" style={{ flexWrap: "wrap" }}>
            <select name="status" defaultValue={status} className="admin-form__input" style={{ minWidth: 180 }}>
              <option value="">All statuses</option>
              {CONTACT_INQUIRY_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <label className="admin-muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>From</span>
              <input type="date" name="from" defaultValue={from} className="admin-form__input" />
            </label>
            <label className="admin-muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>To</span>
              <input type="date" name="to" defaultValue={to} className="admin-form__input" />
            </label>
            <button type="submit">Apply</button>
            <Link href={newOnlyHref} className="admin-quick-action">
              New only
            </Link>
            <Link href="/admin/contact-inquiries" className="admin-quick-action">
              Reset
            </Link>
            <a href={exportHref} className="admin-quick-action">
              Export CSV
            </a>
          </div>
        </div>
        <p className="admin-data-table__meta">
          {total.toLocaleString()} result(s) • Page {page} of {totalPages}
        </p>
      </form>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Received</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(rows as ContactInquiryRow[]).map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{new Date(row.createdAt).toLocaleString()}</strong>
                </td>
                <td>{row.name}</td>
                <td>
                  <div>{row.email}</div>
                  <div className="admin-muted" style={{ margin: 0 }}>{row.phone}</div>
                </td>
                <td>{row.inquiryType}</td>
                <td>
                  <strong>{row.subject}</strong>
                  <p style={{ margin: "6px 0 0", color: "#5e5568" }}>{previewText(row.message)}</p>
                </td>
                <td>
                  <span className={`admin-status-pill ${getStatusPillClass(row.status)}`}>{row.status}</span>
                  {row.emailedAt ? (
                    <p className="admin-muted" style={{ margin: "6px 0 0" }}>
                      emailed {new Date(row.emailedAt).toLocaleString()}
                    </p>
                  ) : null}
                  {row.emailError ? (
                    <p className="admin-error" style={{ margin: "6px 0 0" }}>{row.emailError}</p>
                  ) : null}
                </td>
                <td style={{ minWidth: 200 }}>
                  <ContactInquiryActions id={row.id} status={row.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <p className="admin-muted" style={{ margin: 0 }}>No inquiries yet.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {total > 0 ? (
        <div className="admin-inline-actions" style={{ marginTop: 12 }}>
          {hasPrev ? (
            <Link href={buildPageHref(page - 1)} className="admin-quick-action">
              ← Previous
            </Link>
          ) : (
            <span className="admin-muted">← Previous</span>
          )}
          {hasNext ? (
            <Link href={buildPageHref(page + 1)} className="admin-quick-action">
              Next →
            </Link>
          ) : (
            <span className="admin-muted">Next →</span>
          )}
        </div>
      ) : null}
    </main>
  );
}
