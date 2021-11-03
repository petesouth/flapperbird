import React from "react";
import PropTypes from "prop-types";
import NavigateNext from "@material-ui/icons/NavigateNext";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import MenuItem from "@material-ui/core/MenuItem";

const defaultButton = props => <button {...props}>{props.children}</button>;


const useStyles = theme => ({
  ...styles,
  Table__itemCount: {
    /* margin-top: 10px; */
    fontSize: "12px;",
  },

  Table__pagination: {
    display: "flex;",
    justifyContent: "flex-end;",
    padding: "20px 12px;",
  },

  Table__pageButton: {
    fontSize: "12px;",
    outline: "none;",
    border: "none;",
    backgroundColor: "transparent;",
    cursor: "pointer;",
  },

  Table__pageButtonDisabled: {
    cursor: "not-allowed;",
    color: "gray;",
  },

  Table__pageButtonActive: {
    color: "#45b3e3;",
    fontWeight: "bold;"
  },

})


class Pagination extends React.Component {
  constructor(props) {
    super();

    this.changePage = this.changePage.bind(this);

    this.state = {
      visiblePages: this.getVisiblePages(null, props.pages)
    };
  }

  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    PageButtonComponent: PropTypes.any,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pages !== nextProps.pages) {
      this.setState({
        visiblePages: this.getVisiblePages(null, nextProps.pages)
      });
    }

    this.changePage(nextProps.page + 1);
  }

  filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter(page => page <= totalPages);
  };

  getVisiblePages = (page, total) => {
    if (total < 7) {
      return this.filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  changePage(page) {
    const activePage = this.props.page + 1;

    if (page === activePage) {
      return;
    }

    const visiblePages = this.getVisiblePages(page, this.props.pages);

    this.setState({
      visiblePages: this.filterPages(visiblePages, this.props.pages)
    });

    this.props.onPageChange(page - 1);
  }

  renderPageSizeOptions = ({
    pageSize,
    pageSizeOptions,
    rowsSelectorText,
    onPageSizeChange,
    rowsText,
  }) => (
    <div style={{ width: "100px", paddingBottom: "20px"}}>
    <FormControl
      fullWidth
      className={this.props.classes.selectFormControl}
    >
      <Select
        aria-label={rowsSelectorText}
        onChange={e => onPageSizeChange(Number(e.target.value))}
        value={pageSize}
      >
        {pageSizeOptions.map((option, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem key={i} value={option}>
            {`${option} ${rowsText}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    </div>
  )


  render() {
    const { classes, PageButtonComponent = defaultButton } = this.props;
    const { visiblePages } = this.state;
    const activePage = this.props.page + 1;

    const {
      pageSizeOptions,
      pageSize,
      onPageSizeChange,
      showPageSizeOptions
    } = this.props;

    return (
      <div className={classes.Table__pagination}>
        {this.renderPageSizeOptions({
          pageSize,
          rowsSelectorText: this.props.rowsSelectorText,
          pageSizeOptions: [5, 10, 20, 30, 50, 100, 500, 1000],
          onPageSizeChange,
          rowsText: this.props.rowsText,
        })}

        <div className={classes.Table__prevPageWrapper}>

          <PageButtonComponent
            className={classes.Table__pageButton}
            onClick={() => {
              if (activePage === 1) return;
              this.changePage(activePage - 1);
            }}
            disabled={activePage === 1}
          >
            <NavigateBefore />
          </PageButtonComponent>
        </div>
        <div className={classes.Table__visiblePagesWrapper}>
          {visiblePages.map((page, index, array) => {
            return (
              <PageButtonComponent
                key={page}
                className={
                  activePage === page
                    ? (classes.Table__pageButton, classes.Table__pageButtonActive)
                    : classes.Table__pageButton
                }
                onClick={this.changePage.bind(null, page)}
              >
                {array[index - 1] + 2 < page ? `...${page}` : page}
              </PageButtonComponent>
            );
          })}
        </div>
        <div className={classes.Table__nextPageWrapper}>
          <PageButtonComponent
            className={classes.Table__pageButton}
            onClick={() => {
              if (activePage === this.props.pages) return;
              this.changePage(activePage + 1);
            }}
            disabled={activePage === this.props.pages}
          >
            <NavigateNext />
          </PageButtonComponent>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Pagination)
