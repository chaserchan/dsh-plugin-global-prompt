window.__ModuleLoader__.load({
	id: "dsh-plugin-global-prompt",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region css
		const css = ".gpr-row{border-bottom:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:6px;padding:16px 0;display:flex}.gpr-head{align-items:center;gap:12px;min-width:0;display:flex}.gpr-title{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}.gpr-count{color:var(--dsw-alias-label-tertiary);flex:none;margin-left:auto;font-size:12px;line-height:18px}.gpr-hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.gpr-input{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);width:100%;min-height:120px;color:var(--dsw-alias-label-primary);resize:vertical;border-radius:8px;margin:0;padding:8px 12px;font:inherit;font-size:13px;line-height:1.5}.gpr-input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.gpr-status{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.gpr-status-error{color:var(--dsw-alias-state-error-primary)}";
		const tagId = "dsh-plugin-global-prompt/GlobalPromptRow.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-global-prompt";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region lib/types/client.js
		/** Locale namespace owning this row's copy. */
		const NS = "settings.global-prompt";
		/** Settings namespace registered by the host half. */
		const SETTINGS_NAMESPACE = "global-prompt";
		/** Settings field carrying the prompt text. */
		const SETTINGS_FIELD = "text";
		/** Keep the model context bounded; mirrors the host schema's max. */
		const MAX_LENGTH = 20000;
		/** Autosave quiet window after the last keystroke. */
		const SAVE_DEBOUNCE_MS = 600;

		/** Simplified Chinese dictionary (key-set source of truth). */
		const zh = {
			"title": "全局 Prompt",
			"hint": "注入到每次对话的系统提示词中，保存后对下一条回复立即生效；留空则不注入。",
			"placeholder": "例如：始终使用中文回答；先给出结论，再解释理由……",
			"saved": "已保存",
			"saving": "保存中…",
			"error": "保存失败"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"title": "Global prompt",
			"hint": "Injected into the system prompt of every conversation; takes effect on the next reply after saving. Leave empty to disable.",
			"placeholder": "e.g. Always answer in Chinese; state the conclusion first, then the reasoning…",
			"saved": "Saved",
			"saving": "Saving…",
			"error": "Failed to save"
		};

		/**
		 * Global-prompt preference row registered into the General section item
		 * slot: title + hint + a multi-line textarea that autosaves (debounced)
		 * to the Host settings document through the row's settings scope.
		 * @param props - composed slot props ({@link store} useStore, locale t,
		 *   and the inject face's save()).
		 * @returns the row element tree.
		 */
		function GlobalPromptRow({ t, useStore, save }) {
			const persisted = useStore((s) => s.value);
			const [draft, setDraft] = react.useState(persisted);
			const [status, setStatus] = react.useState("idle");
			const [error, setError] = react.useState(null);
			const draftRef = react.useRef(persisted);
			const timerRef = react.useRef(null);

			// Adopt an externally changed persisted value only when no local edit
			// is pending (the mirror folds our own write back with the same text).
			react.useEffect(() => {
				if (draftRef.current === persisted) return;
				draftRef.current = persisted;
				setDraft(persisted);
			}, [persisted]);

			// Drop a pending save timer on unmount.
			react.useEffect(() => () => {
				if (timerRef.current !== null) clearTimeout(timerRef.current);
			}, []);

			const handleChange = (event) => {
				const next = event.target.value;
				draftRef.current = next;
				setDraft(next);
				setStatus("saving");
				setError(null);
				if (timerRef.current !== null) clearTimeout(timerRef.current);
				timerRef.current = setTimeout(() => {
					timerRef.current = null;
					save(next).then(() => {
						setStatus("saved");
					}).catch((cause) => {
						setStatus("error");
						setError(cause instanceof Error ? cause.message : String(cause));
					});
				}, SAVE_DEBOUNCE_MS);
			};

			const statusText = status === "saved" ? t("saved") : status === "saving" ? t("saving") : status === "error" ? t("error") : "";
			const statusNode = statusText.length === 0 ? null : react_jsx_runtime.jsx("div", {
				className: "gpr-status" + (status === "error" ? " gpr-status-error" : ""),
				role: status === "error" ? "alert" : void 0,
				children: status === "error" && error !== null ? statusText + ": " + error : statusText
			});

			return react_jsx_runtime.jsxs("div", {
				className: "gpr-row",
				children: [
					react_jsx_runtime.jsxs("div", {
						className: "gpr-head",
						children: [
							react_jsx_runtime.jsx("span", { className: "gpr-title", children: t("title") }),
							react_jsx_runtime.jsx("span", { className: "gpr-count", children: String(draft.length) + "/" + String(MAX_LENGTH) })
						]
					}),
					react_jsx_runtime.jsx("div", { className: "gpr-hint", children: t("hint") }),
					react_jsx_runtime.jsx("textarea", {
						className: "gpr-input",
						value: draft,
						onChange: handleChange,
						rows: 6,
						spellCheck: false,
						maxLength: MAX_LENGTH,
						"aria-label": t("title"),
						placeholder: t("placeholder")
					}),
					statusNode
				]
			});
		}

		/**
		 * Row store: a mirror of the settings scope's resolved value. The store
		 * instance is minted per slot entry; its actions are the inject face's
		 * write surface.
		 */
		function createGlobalPromptStore() {
			return (0, _deepseek_ai_dsh_client_runtime_client.defineStore)({
				init: () => ({ value: "" }),
				actions: { sync: (d, value) => {
					d.value = value;
				} }
			});
		}

		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"settingsScope"
		];

		/**
		 * Register the feature-owned Global prompt preference row into the
		 * General section's item slot once the slot declaration is on the ledger.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "global-prompt: dictionaries");
			const t = ctx.locale.bind(NS);
			const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
			const store = createGlobalPromptStore();
			let bound;
			const reflect = (snapshot) => {
				if (snapshot.status === "ready" && snapshot.value !== void 0) {
					bound?.sync(snapshot.value[SETTINGS_FIELD] ?? "");
				}
			};
			ctx.effect(() => scope.subscribe(reflect), "global-prompt: settings scope adoption");
			reflect(scope.getSnapshot());
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "global-prompt",
				order: 10,
				store,
				locale: NS,
				inject: (actions) => {
					bound = actions;
					reflect(scope.getSnapshot());
					return { save: (text) => scope.set(SETTINGS_FIELD, text) };
				}
			}, GlobalPromptRow));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
