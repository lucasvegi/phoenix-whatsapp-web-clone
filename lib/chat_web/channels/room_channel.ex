defmodule ChatWeb.RoomChannel do
  use Phoenix.Channel

  @impl true
  def join("room:geral", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("new_message", payload, socket) do
    case payload do
      %{"name" => name, "message" => message} when is_binary(name) and is_binary(message) ->
        name = String.trim(name)
        msg = String.trim(message)

        if name != "" and msg != "" and String.length(msg) <= 500 do
          broadcast!(socket, "new_message", %{name: name, message: msg})
        end

      _ -> :ok
    end

    {:noreply, socket}
  end

end
