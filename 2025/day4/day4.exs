Path.join(__DIR__, "input.txt")
|> File.stream!()
|> Enum.map(&String.trim_trailing/1)
|> Enum.map(&String.graphemes/1)
|> (fn grid ->
      rows = length(grid)
      cols = grid |> hd() |> length()

      step = fn step, g, removed ->
        accessible =
          for r <- 0..(rows - 1),
              c <- 0..(cols - 1),
              g |> Enum.at(r) |> Enum.at(c) == "@",
              Enum.count(
                for dr <- -1..1,
                    dc <- -1..1,
                    not (dr == 0 and dc == 0),
                    rr = r + dr,
                    cc = c + dc,
                    rr in 0..(rows - 1),
                    cc in 0..(cols - 1) do
                  g |> Enum.at(rr) |> Enum.at(cc)
                end,
                &(&1 == "@")
              ) < 4,
              do: {r, c}

        case accessible do
          [] ->
            removed

          _ ->
            new_grid =
              Enum.reduce(accessible, g, fn {r, c}, acc_grid ->
                List.update_at(acc_grid, r, fn row ->
                  List.update_at(row, c, fn _ -> "." end)
                end)
              end)

            step.(step, new_grid, removed + length(accessible))
        end
      end

      step.(step, grid, 0)
    end).()
|> IO.puts()
