# ASCII Code Stream Design

## Scope

Replace the homepage hero's connected ASCII sculpture with an atmospheric horizontal code and data stream. Preserve the hero content, layout, Canvas renderer, animation lifecycle, palette, text-safety treatment, and accessibility behavior.

## Visual Direction

The background consists of staggered horizontal lanes carrying compact syntax fragments and digital symbols. Examples include braces, operators, hexadecimal values, paths, hashes, short language tokens, and the existing ASCII block characters.

Each lane moves left at a slightly different slow speed. Subtle phase shifts, short gaps, brightness pulses, and small vertical deviations prevent the motion from reading as a rigid marquee. The composition must remain code-like rather than forming a blob, logo, or central object.

Activity increases toward the right through density, opacity, and accent frequency. The left remains quieter and lower-contrast beneath the avatar and copy. Existing blue, green, warm, and neutral tokens remain unchanged.

Kaomoji such as `(>_<)`, `(o_o)`, `(^_^)`, `(•‿•)`, `(._.)`, and `:3` appear as complete tokens embedded within the lanes. At most two should be visible on desktop and one on compact screens.

## Architecture

- Keep `AsciiVectorField` responsible for Canvas setup, sizing, animation scheduling, visibility pausing, reduced motion, and drawing.
- Replace the sculpture-specific procedural model with a deterministic stream model.
- Generate stable lane content from row and segment hashes. Time changes horizontal phase rather than rebuilding React state.
- Return character or token drawing instructions from the model so multi-character kaomoji remain intact and do not overlap adjacent fragments.
- Keep the effect decorative, `aria-hidden`, pointer-inert, and behind the existing foreground content.
- Add no animation dependency.

## Responsive and Motion Behavior

Desktop uses more active lanes and permits up to two kaomoji. Compact mode uses fewer lanes, wider spacing, reduced token density, and at most one kaomoji. The existing left-to-right mask and model opacity limits continue protecting foreground readability.

Normal motion runs through the existing throttled animation loop. Reduced motion renders one static, balanced frame without scheduling continuous animation.

## Testing

Model tests will verify:

- deterministic output for identical dimensions and time;
- horizontal movement between animation phases;
- stronger right-side visual presence;
- lower compact density;
- syntax-token and ASCII-character usage;
- sparse kaomoji limits and intact token rendering;
- opacity limits over the foreground-copy region.

Component tests will continue covering reduced motion, visibility pausing, resizing, and cleanup.

## Non-Goals

- No hero layout or typography redesign.
- No Matrix rain, glitch effects, vertical rainfall, dashboard treatment, or readable fake application code.
- No new dependencies, interactive controls, or separate animation card.
