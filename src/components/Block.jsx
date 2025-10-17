// Import the `useRef` hook from React. This hook allows us to create a mutable reference
// to a DOM element, which we can then access and manipulate directly.
import { useRef } from "react";
// Import the Zustand store hook. This gives our component access to the global state
// and the actions that can modify it, like `addBlock` and `moveBlock`.
import { useBlocksStore } from "../store/blocksStore";

// Define the Block component. It receives a `block` object as a prop,
// which contains all the data for this specific block (id, position, etc.).
export default function Block({ block }) {
  // Destructure the `addBlock` and `moveBlock` actions from the Zustand store.
  // This makes them directly callable within our component.
  const { addBlock, moveBlock } = useBlocksStore();
  // Create a ref that will be attached to the main div of the block.
  // This allows us to get its position and dimensions for drag calculations.
  const blockRef = useRef(null);
  // Declare variables to hold the mouse's offset from the top-left corner of the block
  // when a drag operation begins. These are defined outside the event handlers
  // so they can be accessed by both onMouseDown and onMouseMove.
  let offsetX, offsetY;
  
  // This function is triggered when the user presses the mouse button down on the block.
  // It's the starting point for our drag-and-drop functionality.
  const onMouseDown = (e) => {
    // Get the current size and position of the block element relative to the viewport.
    const rect = blockRef.current.getBoundingClientRect();
    // Calculate and store the horizontal distance from the mouse cursor to the block's left edge.
    offsetX = e.clientX - rect.left;
    // Calculate and store the vertical distance from the mouse cursor to the block's top edge.
    offsetY = e.clientY - rect.top;

    // Attach event listeners to the entire document. This is crucial because it allows
    // the drag to continue smoothly even if the user's mouse moves outside the block's boundaries.
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  
  // This function is called every time the mouse moves after the onMouseDown event has fired.
  const onMouseMove = (e) => {
    // Call the `moveBlock` action from the Zustand store to update the block's position.
    // The new position is calculated by taking the current mouse coordinates (e.clientX, e.clientY)
    // and subtracting the initial offset. This ensures the block moves relative to where it was grabbed.
    moveBlock(block.id, e.clientX - offsetX, e.clientY - offsetY);
  };
  
  // This function is triggered when the user releases the mouse button anywhere on the page.
  const onMouseUp = () => {
    // Clean up by removing the event listeners from the document. This is essential to
    // stop the drag operation and prevent the block from continuing to follow the mouse.
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  
  // The JSX that renders the visual representation of the block.
  return (
    <div
      // Attach the ref to this div so we can access it in our JavaScript logic.
      ref={blockRef}
      // Register the onMouseDown function to handle the start of a drag.
      onMouseDown={onMouseDown}
      // Apply Tailwind CSS classes for styling. `absolute` is key for positioning,
      // and `select-none` prevents unwanted text selection during dragging.
      className="absolute flex flex-col items-center justify-center w-32 h-32 text-white font-semibold rounded-md bg-fuchsia-700 select-none"
      style={{
        // The block's position is controlled by inline styles, which are updated from the global state.
        left: block.x,
        top: block.y,
        // A short transition provides a subtle smoothing effect as the block moves.
        transition: "left 0.05s, top 0.05s",
      }}
    >
      {/* Display the unique ID of the block. */}
      <div>{block.id}</div>
      {/* This is the button to create a new child block. */}
      <button
        onClick={(e) => {
          // Stop the click event from bubbling up to the parent div's onMouseDown handler,
          // which would otherwise start a drag operation.
          e.stopPropagation();
          // Call the `addBlock` action, passing the current block's ID as the parentId.
          addBlock(block.id);
        }}
        className="mt-3 bg-pink-300 text-pink-700 w-16 py-1 rounded-md font-bold"
      >
        +
      </button>
    </div>
  );
}
