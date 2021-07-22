import { forwardRef } from "react";
import { IconButton, MenuItem } from "@material-ui/core";

interface Props {
  onClick: () => void;
  iconComponent: React.ReactNode;
  ariaLabel: string;
  ariaControls: string;
  text: string;
}

type Ref = HTMLLIElement;

const MobileItem = forwardRef<Ref, Props>(
  ({ onClick, iconComponent, ariaLabel, ariaControls, text }, ref) => {
    return (
      <MenuItem onClick={onClick} ref={ref} style={{ paddingLeft: 0 }}>
        <IconButton
          aria-label={ariaLabel}
          aria-controls={ariaControls}
          aria-haspopup="true"
          color="inherit"
        >
          {iconComponent}
        </IconButton>
        <p>{text}</p>
      </MenuItem>
    );
  }
);

export default MobileItem;
