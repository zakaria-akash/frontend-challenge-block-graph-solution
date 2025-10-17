// This component is responsible for rendering a single dashed line between two blocks.
// It takes a `parent` block and a `child` block object as props.
export default function ConnectionLine({ parent, child }) {
  // Calculate the starting coordinates (x1, y1) for the line.
  // The parent block's position (parent.x, parent.y) is its top-left corner.
  // Since the block is 128px wide and 128px high (w-32, h-32 in Tailwind),
  // we add 64px to get the coordinates of its center.
  const x1 = parent.x + 64;
  const y1 = parent.y + 64;

  // Calculate the ending coordinates (x2, y2) for the line.
  // We do the same calculation for the child block to find its center point.
  const x2 = child.x + 64;
  const y2 = child.y + 64;

  // The component returns an SVG (Scalable Vector Graphics) element.
  // SVG is ideal for drawing shapes like lines, circles, and paths directly in the DOM.
  return (
    <svg
      // These Tailwind classes create a full-screen overlay for the SVG canvas.
      // `absolute top-0 left-0` positions it at the top-left of the nearest positioned ancestor (the main app div).
      // `w-full h-full` makes it span the entire screen.
      // `pointer-events-none` is crucial: it makes the SVG layer "invisible" to mouse clicks,
      // allowing the user to interact with the blocks underneath without the SVG intercepting the events.
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    >
      {/* The <line> element is an SVG primitive that draws a straight line. */}
      <line
        // The start (x1, y1) and end (x2, y2) points of the line.
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        // Defines the visual style of the line.
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    </svg>
  );
}
