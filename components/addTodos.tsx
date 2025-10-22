import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormHelperText,
} from "@mui/material";

type AddTodosModalProps = {
  isOpen: boolean;
  onClose: () => void;
  addTodo: (todo: { todo: string; completed: boolean }) => void;
};

const AddTodosModal = ({ isOpen, onClose, addTodo }: AddTodosModalProps) => {
  const [todoInput, setTodoInput] = useState("");
  const [error, setError] = useState("");

  const validateInput = (value: string) => {
    if (!value.trim()) {
      setError("Todo title is required");
      return false;
    }
    if (value.trim().length < 3) {
      setError("Todo title must be at least 3 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTodoInput(value);
    if (error) {
      validateInput(value);
    }
  };

  const handleAddTodo = () => {
    if (validateInput(todoInput)) {
      addTodo({ todo: todoInput, completed: false });
      setTodoInput("");
      setError("");
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleClose = () => {
    setTodoInput("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      maxWidth="sm"
      fullWidth
      aria-labelledby="add-todo-dialog-title"
      aria-describedby="add-todo-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#e0cbda",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        id="add-todo-dialog-title"
        sx={{ fontFamily: "Playfair Display, serif", fontWeight: "bold" }}
      >
        Add New Todo
      </DialogTitle>
      <DialogContent>
        <div id="add-todo-dialog-description" className="sr-only">
          Enter the title for your new todo item
        </div>
        <FormControl fullWidth error={!!error} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={todoInput}
            onChange={handleInputChange}
            onBlur={() => validateInput(todoInput)}
            placeholder="Enter todo title"
            variant="outlined"
            aria-label="Todo title"
            error={!!error}
            slotProps={{
              input: {
                "aria-required": "true",
                "aria-invalid": !!error,
                "aria-describedby": error ? "todo-error-text" : undefined,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: "#9333ea",
                },
                "&:hover fieldset": {
                  borderColor: "#7e22ce",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7e22ce",
                },
              },
              fontFamily: "Playfair Display, serif",
            }}
          />
          {error && (
            <FormHelperText id="todo-error-text" error>
              {error}
            </FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          aria-label="Cancel adding todo"
          sx={{
            bgcolor: "gray",
            "&:hover": {
              bgcolor: "tomato",
            },
            fontFamily: "Playfair Display, serif",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddTodo}
          variant="contained"
          aria-label="Add new todo"
          sx={{
            bgcolor: "#7127b5",
            "&:hover": {
              bgcolor: "#551c89",
            },
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
          }}
        >
          Add Todo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddTodosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addTodo: PropTypes.func.isRequired,
};

export default AddTodosModal;