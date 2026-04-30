import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type AdminSectionProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
	children: ReactNode;
	title?: string;
	/** Tighter outer padding — use when a full-width table fills the section */
	flush?: boolean;
};

export default function AdminSection({
	children,
	title,
	className = "",
	flush = false,
	...rest
}: AdminSectionProps) {
	const cls = [
		flush ? "admin-section--flush" : "",
		className.trim(),
	]
		.filter(Boolean)
		.join(" ");

	const titleCls = flush ? "admin-section__title admin-section__title--flush" : "admin-section__title";

	return (
		<section className={cls} {...rest}>
			{title ? <h2 className={titleCls}>{title}</h2> : null}
			{children}
		</section>
	);
}
