Path.join(__DIR__, "input.txt")
|> File.stream!()
|> Enum.map(fn line ->
  digits =
    line
    |> String.trim()
    |> String.graphemes()

  {picked, _start} =
    Enum.reduce(1..12, {[], 0}, fn _, {acc, start} ->
      remaining = 12 - length(acc)
      limit = length(digits) - remaining

      {best_digit, best_index} =
        digits
        |> Enum.slice(start..limit)
        |> Enum.with_index(start)
        |> Enum.max_by(fn {d, _i} -> d end)

      {[best_digit | acc], best_index + 1}
    end)

  picked
  |> Enum.reverse()
  |> Enum.join()
  |> String.to_integer()
end)
|> Enum.sum()
|> IO.puts()
