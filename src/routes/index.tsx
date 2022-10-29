import { $, component$, useClientEffect$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

interface Todos {
  todos: string[];
}

interface IEdit {
  editing: boolean;
}

export default component$(() => {
  const state = useStore({ value: "" });
  const todos = useStore<Todos>({ todos: [] }, { recursive: true });
  const editStore = useStore<IEdit>({ editing: false });
  const editValue = useStore({ value: "" });

  useClientEffect$(() => {
    const getTodos = () => {
      const data = localStorage.getItem("todos");

      if (!data) return;

      const storedTodos: string[] = JSON.parse(data);

      todos.todos = storedTodos;
    };
    getTodos();
  });

  return (
    <div class="flex items-center flex-col px-5 lg:px-0">
      <h1 class="text-5xl mt-10">Qwik Todos</h1>

      <form
        class="mt-10 w-full max-w-lg"
        preventdefault:submit
        onSubmit$={$(() => {
          if (state.value.trim() === "") return;

          todos.todos.unshift(state.value);

          localStorage.setItem("todos", JSON.stringify(todos.todos));

          state.value = "";
        })}
      >
        <label class="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
          Todo:
        </label>
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight outline-none focus:bg-white focus:border-purple-500 transition-all ease-in-out duration-300"
          type="text"
          placeholder="Go shopping..."
          value={state.value}
          // @ts-ignore
          onInput$={(e) => (state.value = e.target.value)}
        />
        <button class="bg-purple-500 py-2 px-6 mt-3 rounded-2xl text-gray-200 hover:bg-purple-400 transition-all ease-in-out duration-150">
          Submit
        </button>
      </form>
      {todos.todos.map((todo, i) => (
        <>
          <div class="flex justify-between max-w-lg w-full mt-5 gap-6">
            <p
              class="cursor-pointer w-full"
              onClick$={(event) => {
                // @ts-ignore
                event.target.classList.toggle("line-through");
                editStore.editing = false;
              }}
            >
              {todo}
            </p>

            <div class="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="stroke-blue-500 hover:stroke-blue-400 cursor-pointer duration-300"
                onClick$={() => (editStore.editing = !editStore.editing)}
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="stroke-red-500 hover:stroke-red-400 cursor-pointer duration-300"
                onClick$={$(() => {
                  todos.todos.splice(i, 1);
                  editStore.editing = false;
                  editValue.value = "";
                  localStorage.setItem("todos", JSON.stringify(todos.todos));
                })}
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
          </div>

          <div class="w-full max-w-lg mt-5 md:px-10">
            {editStore.editing && (
              <form
                class="flex flex-col items-center justify-around w-full  md:flex-row"
                preventdefault:submit
                onSubmit$={$(() => {
                  todos.todos[i] = editValue.value;
                  editStore.editing = false;
                  localStorage.setItem("todos", JSON.stringify(todos.todos));
                })}
              >
                <input
                  type="text"
                  value={editValue.value}
                  placeholder="I need to edit this..."
                  // @ts-ignore
                  onInput$={(e) => (editValue.value = e.target.value)}
                  class="decoration-transparent bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 mb-3 text-gray-700 leading-tight outline-none focus:bg-white focus:border-purple-500 transition-all ease-in-out duration-300 md:mb-0"
                />
                <button class="bg-purple-500 py-2 px-6 mx-2 rounded-2xl text-gray-200 hover:bg-purple-400 transition-all ease-in-out duration-150">
                  Submit
                </button>
              </form>
            )}
          </div>
        </>
      ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
