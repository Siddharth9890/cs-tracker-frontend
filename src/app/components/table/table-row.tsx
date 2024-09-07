import Link from "next/link";
import { TableRow, Checkbox, TableCell, ListItemText } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import LaunchIcon from "@mui/icons-material/Launch";

import { Question } from "@/types";
import { fDate } from "@/utils/format-date";

type Props = {
  selected: boolean;
  row: Question;
  onSelectRow: VoidFunction;
};

export default function QuestionTableRow({
  row,
  selected,
  onSelectRow,
}: Props) {
  const { name, bookMark, solvingLink, solutionLink, note, revisionDate } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ alignItems: "center" }}>
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: "body2" }}
            secondaryTypographyProps={{
              component: "span",
              color: "text.disabled",
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Link
            target="_blank"
            passHref
            href={solvingLink}
            style={{ textDecoration: "none" }}
          >
            <LaunchIcon
              sx={{
                color: "text.disabled",
                fontSize: "body2.fontSize",
                position: "relative",
                top: 3.5,
                left: 8,
              }}
            />
          </Link>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {note.length === 0 ? (
            <NoteAddOutlinedIcon />
          ) : (
            <EditNoteOutlinedIcon />
          )}
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {bookMark ? <BookmarkOutlinedIcon /> : <BookmarkBorderOutlinedIcon />}
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {revisionDate === null ? "-" : fDate(revisionDate)}
        </TableCell>
      </TableRow>
    </>
  );
}
