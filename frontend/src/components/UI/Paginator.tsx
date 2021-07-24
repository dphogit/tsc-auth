import Button from "@material-ui/core/Button";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

interface Props {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const Paginator = ({ hasPrev, hasNext, onPrev, onNext }: Props) => {
  return (
    <div>
      {hasPrev && (
        <Button
          onClick={onPrev}
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIosIcon />}
          size="small"
          style={{ marginRight: "1rem" }}
        >
          Prev
        </Button>
      )}
      {hasNext && (
        <Button
          onClick={onNext}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIosIcon />}
          size="small"
          style={{ marginLeft: "1rem" }}
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default Paginator;
