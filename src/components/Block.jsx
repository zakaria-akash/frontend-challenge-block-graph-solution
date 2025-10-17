// Import the `useRef` hook from React. This hook allows us to create a mutable reference
// that can be attached to a DOM element, giving us direct access to it.
import { useRef } from "react";
// Import the Zustand store hook. This gives our component access to the global state
// and the actions that can modify it.
import { useBlocksStore } from "../store/blocksStore";

// Define the Block component. It receives a `block` object as a prop,
// which contains all the data for this specific block (id, position, parentId, etc.).
export default function Block({ block }) {
  // Destructure the actions and state we need from the Zustand store.
  // This makes them directly callable and accessible within our component.
  // `blocks` is the full array of all blocks on the canvas.
  const { addBlock, moveBlock, deleteBlockAndChildren, blocks } =
    useBlocksStore();
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

  // --- Logic for disabling the delete button ---
  // Check if there is only one block on the screen.
  const isRootOnly = blocks.length === 1;
  // The delete button should be disabled if it's the *only* block on the screen AND it's a root block.
  const isDisabled = isRootOnly && block.parentId === null;

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

      {/* A container for the action buttons. */}
      <div className="flex gap-2 mt-3">
        {/* ➕ Add Child */}
        <button
          onClick={(e) => {
            // Stop the click event from bubbling up to the parent div's onMouseDown handler,
            // which would otherwise incorrectly start a drag operation.
            e.stopPropagation();
            // Call the `addBlock` action from the store, passing the current block's ID as the parentId.
            addBlock(block.id);
          }}
          className="bg-pink-300 text-pink-700 w-8 h-8 rounded-md font-bold hover:bg-pink-400"
        >
          +
        </button>

        {/* ➖ Delete (disabled for single root block) */}
        <button
          onClick={(e) => {
            // Stop the event from bubbling up to the parent div.
            e.stopPropagation();
            // Only call the delete function if the button is not disabled.
            if (!isDisabled) deleteBlockAndChildren(block.id);
          }}
          // The `disabled` attribute prevents clicks and is used for styling.
          disabled={isDisabled}
          // Dynamically apply classes based on the `isDisabled` state.
          // This provides visual feedback to the user, making the button look inactive.
          className={`w-8 h-8 rounded-md font-bold ${
            isDisabled
              ? "bg-pink-200 text-pink-400 cursor-not-allowed opacity-50"
              : "bg-pink-300 text-pink-700 hover:bg-pink-400"
          }`}
        >
          −
        </button>
      </div>
    </div>
  );
}
