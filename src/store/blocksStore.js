// Import the `create` function from the Zustand library. This is the core function
// used to create a new state management store.
import { create } from "zustand";

// Create and export the custom hook `useBlocksStore`. This hook will be used in
// React components to access the store's state and actions.
// The `create` function takes a callback that defines the store's initial state and actions.
// The `set` function provided by Zustand is used to update the state immutably.
export const useBlocksStore = create((set) => ({
  // `blocks` is the main state property. It's an array that will hold all our block objects.
  // We initialize it with a single "root" block.
  blocks: [
    {
      // The ID is set to 0. Note: Using the array length for IDs can be problematic
      // if blocks are ever deleted, as IDs might be reused. A more robust solution
      // would use a library like `nanoid` or a simple counter.
      id: 0,
      // The `parentId` is null, indicating this is a root block with no parent.
      parentId: null,
      // The initial x and y coordinates are randomized to appear within the first 70%
      // of the window's width and height, preventing them from spawning too close to the edge.
      x: Math.random() * window.innerWidth * 0.7,
      y: Math.random() * window.innerHeight * 0.7,
    },
  ],

  // `addBlock` is an action to add a new block to the state.
  // It takes the `parentId` of the block that initiated its creation.
  addBlock: (parentId) =>
    // We call `set` with a function that receives the current `state`.
    // This ensures we are always working with the most up-to-date state.
    set((state) => {
      // Define the new block object.
      const newBlock = {
        // The new block's ID is simply the current number of blocks.
        id: state.blocks.length,
        parentId,
        // Its position is also randomized.
        x: Math.random() * window.innerWidth * 0.7,
        y: Math.random() * window.innerHeight * 0.7,
      };
      // Return the new state object. It's crucial to create a *new* array
      // by spreading the existing `state.blocks` and adding the `newBlock`.
      // This immutability is what allows React to detect the change and re-render.
      return { blocks: [...state.blocks, newBlock] };
    }),

  // `moveBlock` is an action to update the position of a specific block.
  // It takes the `id` of the block to move, and its new `x` and `y` coordinates.
  moveBlock: (id, x, y) =>
    set((state) => ({
      // We map over the `blocks` array to create a new array.
      blocks: state.blocks.map((b) =>
        // If the current block's `id` matches the one we want to move...
        b.id === id ? { ...b, x, y } : b
        // ...create a new block object with the updated x and y coordinates.
        // Otherwise, return the block unmodified.
      ),
    })),
}));
