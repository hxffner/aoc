Path.join(__DIR__, "input.txt")
|> File.stream!()
|> Enum.map(fn line ->
  line
  |> String.trim()
  |> String.split(",", trim: true)
  |> Enum.flat_map(fn range ->
    [from_str, to_str] = String.split(range, "-")
    from = String.to_integer(from_str)
    to = String.to_integer(to_str)

    if from <= to do
      from..to
    else
      to..from
    end
  end)
  |> Enum.map(fn n ->
    s = Integer.to_string(n)
    len = String.length(s)

    is_invalid =
      if len < 2 do
        false
      else
        Enum.any?(1..div(len, 2), fn chunk_len ->
          rem(len, chunk_len) == 0 and
            String.duplicate(
              String.slice(s, 0, chunk_len),
              div(len, chunk_len)
            ) == s
        end)
      end

    if is_invalid, do: n, else: 0
  end)
  |> Enum.sum()
end)
|> Enum.sum()
|> IO.puts()
