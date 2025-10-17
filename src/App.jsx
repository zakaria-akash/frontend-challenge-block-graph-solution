// Import the Zustand store hook to access the global state of blocks.
// Note: This component uses `blocksStore.js`. Other components like `Canvas.jsx` use a different store (`blocks.js`).
import { useBlocksStore } from "./store/blocksStore";
// Import the Block component, which represents a single draggable node on the canvas.
import Block from "./components/Block";
// Import the ConnectionLine component, which is responsible for drawing a line between two blocks.
import ConnectionLine from "./components/ConnectionLine";

// This is the root component for the application. It orchestrates the rendering
// of all blocks and the lines connecting them.
export default function App() {
  // Use the Zustand hook to subscribe to the `blocks` array in the global state.
  // The component will automatically re-render whenever this array changes.
  const { blocks } = useBlocksStore();

  // The main return statement that defines the structure of the UI.
  return (
    // This is the main container, or "canvas".
    // `relative` is crucial because it establishes a coordinate system for the absolutely positioned blocks and lines inside.
    // `w-screen h-screen` makes it fill the entire viewport.
    // `overflow-hidden` prevents scrollbars from appearing if a block is dragged outside the window boundaries.
    <div className="relative w-screen h-screen bg-pink-100 overflow-hidden">
      {/* This section is responsible for rendering the connection lines. */}
      {blocks.map((child) => {
        // A block is a child if it has a `parentId`. Root blocks have `parentId: null`, so we skip them.
        if (child.parentId === null) return null;
        // For each child block, we need to find its corresponding parent block in the `blocks` array.
        const parent = blocks.find((b) => b.id === child.parentId);
        // Render the ConnectionLine component.
        return (
          <ConnectionLine
            // A unique key is required by React for list rendering. This helps React efficiently update the DOM.
            key={`line-${child.id}`}
            // Pass the parent and child block objects as props so the line knows its start and end points.
            parent={parent}
            child={child}
          />
        );
      })}

      {/* This section is responsible for rendering all the individual blocks. */}
      {blocks.map((block) => (
        // For each block object in the state, render a `Block` component.
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}
