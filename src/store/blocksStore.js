// Import the `create` function from the Zustand library. This is the core function
// used to create a new state management store.
import { create } from "zustand";

// Create and export the custom hook `useBlocksStore`. This hook will be used in
// React components to access the store's state and actions.
// The `create` function takes a callback that defines the store's initial state and actions.
// The `set` function is used to update state immutably.
// The `get` function allows you to access the current state, which is useful for actions
// that need to read state without triggering a re-render.
export const useBlocksStore = create((set, get) => ({
  // `blocks` is the main state property. It's an array that will hold all our block objects.
  // We initialize it with a single "root" block.
  blocks: [
    {
      // The ID is set to 0.
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
        // To ensure a unique ID, we find the maximum existing ID and add 1.
        // This is more robust than using `state.blocks.length` as it prevents
        // ID conflicts if blocks are deleted. If no blocks exist, we start at 0.
        id: state.blocks.length
          ? Math.max(...state.blocks.map((b) => b.id)) + 1
          : 0,
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
        b.id === id
          ? // ...create a new block object with the updated x and y coordinates.
          { ...b, x, y }
          : // Otherwise, return the block unmodified.
          b
      ),
    })),

  // `deleteBlockAndChildren` is an action that removes a block and all of its descendants.
  deleteBlockAndChildren: (id) => {
    // This is a recursive helper function to find all descendants of a given block.
    const getAllDescendants = (blockId, blocks) => {
      // Find the direct children of the current block.
      const children = blocks.filter((b) => b.parentId === blockId);
      // Start a list of all descendants with the direct children.
      let all = [...children];
      // For each child, recursively call this function to find their children,
      // and add them to the list.
      children.forEach((child) => {
        all = all.concat(getAllDescendants(child.id, blocks));
      });
      return all;
    };

    // Use `get()` to read the current state of all blocks from the store.
    const allBlocks = get().blocks;
    // Create an array of IDs to remove, starting with the clicked block's ID
    // and adding all of its descendants' IDs.
    const toRemove = [id, ...getAllDescendants(id, allBlocks).map((b) => b.id)];

    // Create a new array of blocks, filtering out any block whose ID is in the `toRemove` list.
    let updatedBlocks = allBlocks.filter((b) => !toRemove.includes(b.id));

    // As a safeguard, if all blocks have been removed, create a new root block
    // to prevent a blank screen.
    if (updatedBlocks.length === 0) {
      updatedBlocks = [
        {
          id: 0,
          parentId: null,
          x: Math.random() * window.innerWidth * 0.7,
          y: Math.random() * window.innerHeight * 0.7,
        },
      ];
    }

    // Finally, call `set` to update the state with the new, filtered array of blocks.
    set({ blocks: updatedBlocks });
  },
}));
