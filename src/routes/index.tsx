import { $, component$, useClientEffect$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

interface Todo {
  todos: {
    value: string;
    isDone: boolean;
    editing?: boolean;
  }[];
}

export default component$(() => {
  const newTodoStore = useStore({ value: "" });
  const todoStore = useStore<Todo>({ todos: [] }, { recursive: true });
  const editStore = useStore({ value: "", isEditing: false });

  useClientEffect$(() => {
    const getTodos = () => {
      const data = localStorage.getItem("todos");

      if (!data) return;

      const storedTodos: Todo = JSON.parse(data);

      if (!storedTodos.todos) return;

      return storedTodos.todos.map(({ value, isDone }, i) => {
        todoStore.todos[i] = { value, isDone };
      });
    };
    getTodos();
  });

  return (
    <div class="flex items-center flex-col px-5 overflow-x-hidden lg:px-0">
      <h1 class="text-5xl mt-10">Qwik Todos</h1>
      <p class="italic p-10">click on tasks to mark them as done</p>

      <form
        class="mt-2 w-full max-w-lg"
        preventdefault:submit
        onSubmit$={$(() => {
          if (newTodoStore.value.trim() === "") return;

          todoStore.todos.unshift({ value: newTodoStore.value, isDone: false });

          localStorage.setItem("todos", JSON.stringify(todoStore));

          newTodoStore.value = "";
        })}
      >
        <label class="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
          Todo:
        </label>
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight outline-none focus:bg-white focus:border-purple-500"
          type="text"
          placeholder="Go shopping..."
          value={newTodoStore.value}
          // @ts-ignore
          onInput$={(e) => (newTodoStore.value = e.target.value)}
        />
        <button class="bg-purple-500 py-2 px-6 mt-3 rounded-2xl text-gray-200 hover:bg-purple-400">
          Submit
        </button>
      </form>
      {todoStore.todos &&
        todoStore.todos.map((todo, i) => (
          <>
            <div class="flex justify-between max-w-lg w-full mt-5 gap-6">
              <p
                class={`cursor-pointer break-all ${
                  todo.isDone ? "line-through" : ""
                }`}
                onClick$={() => {
                  todo.isDone = !todo.isDone;
                  todo.editing = false;
                  editStore.isEditing = false;
                  localStorage.setItem("todos", JSON.stringify(todoStore));
                }}
              >
                {todo.value}
              </p>

              <div class="flex gap-2">
                {!editStore.isEditing && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="stroke-blue-500 hover:stroke-blue-400 cursor-pointer"
                    onClick$={$(() => {
                      if (editStore.isEditing) return;

                      editStore.isEditing = true;
                      todo.editing = true;
                    })}
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                )}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="stroke-red-500 hover:stroke-red-400 cursor-pointer"
                  onClick$={$(() => {
                    todoStore.todos.splice(i, 1);
                    editStore.value = "";
                    localStorage.setItem(
                      "todos",
                      JSON.stringify(todoStore.todos)
                    );
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
              {todo.editing && editStore.isEditing && (
                <form
                  class="flex flex-col items-center justify-around w-full"
                  preventdefault:submit
                  onSubmit$={$(() => {
                    if (editStore.value.trim() === "") return;
                    todo.value = editStore.value;

                    todo.editing = false;
                    editStore.isEditing = false;

                    localStorage.setItem(
                      "todos",
                      JSON.stringify(todoStore.todos)
                    );
                  })}
                >
                  <input
                    type="text"
                    value={todo.value}
                    placeholder="I need to edit this..."
                    // @ts-ignore
                    onInput$={(e) => (editStore.value = e.target.value)}
                    class="decoration-transparent bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight outline-none focus:bg-white focus:border-purple-500 transition-all ease-in-out duration-300"
                  />
                  <div class="flex mt-3">
                    <button class="bg-purple-500 py-2 px-6 mx-2 rounded-2xl text-gray-200 hover:bg-purple-400 transition-all ease-in-out duration-150">
                      Submit
                    </button>
                    <button
                      class="bg-red-500 py-2 px-6 mx-2 rounded-2xl text-gray-200 hover:bg-red-400 transition-all ease-in-out duration-150"
                      onClick$={$(() => {
                        todo.editing = false;
                        editStore.isEditing = false;
                      })}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Todos",
};
