import z from "@deepseek-ai/schemastery";

/**
 * dsh-plugin-global-prompt — host (server) half.
 *
 * Registers one durable settings namespace (`global-prompt.text`) and injects
 * its value as a live system-prompt section. The section text is a function
 * re-evaluated on every model step, so saving in the Settings panel takes
 * effect on the next reply without a restart (the settings file provider
 * hot-reloads `$DSH_HOME/settings.yaml` and re-resolves the namespace).
 */

/** Settings namespace owned by this plugin (lowercase kebab, per dsh-settings). */
const NAMESPACE = "global-prompt";
/** Field carrying the global prompt text. */
const FIELD = "text";
/** Prompt section name; global sections apply to every agent and session. */
const SECTION_NAME = "user:global-prompt";
/** Render position: immediately after the deployment persona (order 0). */
const SECTION_ORDER = 5;
/** Upper bound protecting the model context from accidental giant inputs. */
const MAX_LENGTH = 20000;

const GlobalPromptSchema = z.object({
  [FIELD]: z.string().default("").max(MAX_LENGTH),
});

/** Validate the namespace pattern so a bad edit fails at load, not at write. */
function assertNamespace(value) {
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    throw new TypeError(`settings namespace "${value}" must match /^[a-z][a-z0-9-]*$/`);
  }
  return value;
}

/**
 * Register the durable global-prompt setting and inject it as a live system
 * prompt section.
 * @param ctx - host plugin context.
 */
function apply(ctx) {
  ctx.inject(["settings", "systemPrompt"], (sctx) => {
    const scope = sctx.settings.register(assertNamespace(NAMESPACE), GlobalPromptSchema);
    sctx.systemPrompt.section({
      name: SECTION_NAME,
      order: SECTION_ORDER,
      text: () => scope.get()?.[FIELD] ?? "",
    });
  });
}

export { apply };
