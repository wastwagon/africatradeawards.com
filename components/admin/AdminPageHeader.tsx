import type { ReactNode } from "react";

export type AdminPageHeaderProps = {
	title: string;
	/** Small uppercase line above the title (e.g. area name) */
	eyebrow?: string;
	description?: ReactNode;
	/** Toolbar or primary links — uses flex wrap; combine with `admin-inline-actions` on children */
	actions?: ReactNode;
};

/** Consistent admin page title + optional lede + optional action row */
export default function AdminPageHeader({ title, eyebrow, description, actions }: AdminPageHeaderProps) {
	return (
		<header className="admin-page-header">
			<div className="admin-page-header__intro">
				{eyebrow ? <p className="admin-page-header__eyebrow">{eyebrow}</p> : null}
				<h1>{title}</h1>
				{description ? <p className="admin-muted">{description}</p> : null}
			</div>
			{actions ? <div className="admin-page-header__actions">{actions}</div> : null}
		</header>
	);
}
