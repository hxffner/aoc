{final_dial, zeros} =
  Path.join(__DIR__, "input.txt")
  |> File.stream!()
  |> Enum.reduce({50, 0}, fn line, {dial, zero_count} ->
    line = String.trim(line)

    <<dir::binary-size(1), rest::binary>> = line
    distance = String.to_integer(rest)

    zeros_this_rotation =
      case dir do
        "L" ->
          Enum.count(1..distance, fn step ->
            Integer.mod(dial - step, 100) == 0
          end)

        "R" ->
          Enum.count(1..distance, fn step ->
            Integer.mod(dial + step, 100) == 0
          end)
      end

    new_dial =
      case dir do
        "L" -> Integer.mod(dial - distance, 100)
        "R" -> Integer.mod(dial + distance, 100)
      end

    new_zero_count =
      # if new_dial == 0, do: zero_count + 1, else: zero_count
      zero_count + zeros_this_rotation

    {new_dial, new_zero_count}
  end)

IO.puts("Final dial position: #{final_dial}")
IO.puts("Number of times dial was at zero: #{zeros}")
