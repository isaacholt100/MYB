import React from 'react';
import NProgress from 'nprogress';
import { withStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';

NProgress.configure({
  template: `
    <div class="nprogress-bar" role="bar">
    </div>
  `,
  showSpinner: false,
});

const styles = (theme) => {

  return {
    '@global': {
      '#nprogress': {
        direction: 'ltr',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        zIndex: theme.zIndex.tooltip,
        backgroundColor: theme.palette.background.default,
        "& *": {
            opacity: 1,
        },
        '& .nprogress-bar': {
          backgroundColor: "#4caf50",
          height: 4,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      },
    },
  };
};

const GlobalStyles = withStyles(styles, { flip: false, name: 'MuiNProgressBar' })(() => null);

/**
 * Elegant and ready to use wrapper on top of https://github.com/rstacruz/nprogress/.
 * The implementation is highly inspired by the YouTube one.
 */
function NProgressBar(props) {
  return (
    <NoSsr>
      {props.children}
      <GlobalStyles />
    </NoSsr>
  );
}

export default NProgressBar;