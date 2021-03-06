import React from 'react';
import moment from 'moment';
import store from '../store/store';
import {connect} from 'react-redux';
import Titlebar from './Titlebar';
import {fetchAppData, setNShow} from '../actions/actionFactory';
import {Link, withRouter} from 'react-router-dom';

const VideoListItem = (props) => (
  <div className="mb-5 col-12 col-md-6 col-lg-4">
    <div className="card">
      <Link to={props.href}>
        <img className="card-img-top" src={props.imgSrc}/>
      </Link>
      <div className="card-body">
        <Link to={props.href}>
          <h6 className="card-title text-muted">
            <i className="fas fa-play-circle"></i>
            {props.title}
          </h6>
        </Link>
        <div className="justify-content-between d-flex">
          <small className="text-muted"><i className="fas fa-eye"></i> {props.nView}</small>
          <small className="text-muted text-right">{moment(props.date).format('l')}</small>
        </div>
      </div>
    </div>
  </div>
);

const VideoListBoard = (props) => (
  <div className="row mt-3 justify-content-left">
    {props.videoObjs.slice(0, !!props.nShow ? props.nShow : props.videoObjs.length).map((videoObj) => (
      <VideoListItem key={videoObj.groupTitle+videoObj.index} {...videoObj}/>
    ))}
  </div>
);

const mapStateToProps = (state) => {
  return {groups: state.video.groups};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNShow: (groupIndex, nShow) => {
      dispatch(setNShow('video')({groupIndex, nShow}));
    },
    fetchData: () => {
      dispatch(fetchAppData('video'));
    }
  };
}

class VideoList extends React.Component {
  constructor(props) {
    super(props);

    this.fetchGroupInfo();
  }

  componentWillMount() {
    this.getTargetGroups();
  }

  componentDidMount() {
    (this.props.groups.length === 0) && this.props.fetchData();
  }

  fetchGroupInfo = () => {
    const groupIndexStr = this.props.match.params.groupIndex || "-1";
    this.groupIndex = parseInt(groupIndexStr);
    this.groupTitle = this.props.match.params.groupName || '';

    if (this.groupIndex === -1 && !!this.groupTitle) {
      this.groupIndex = this.props.groups.findIndex((group) => group.groupTitle === this.groupTitle);
      if (this.groupIndex === -1) {
        this.groupTitle = '';
      }
    } else if (this.groupIndex !== -1) {
      if (this.groupIndex < 0 || this.groupIndex >= this.props.groups.length) {
        this.groupIndex = -1;
        this.groupTitle = '';
      } else {
        this.groupTitle = this.props.groups[this.groupIndex].groupTitle;
      }
    }
  }

  getTargetGroups = () => {
    this.fetchGroupInfo();

    if (this.groupIndex === -1) {
      this.targetGroups = this.props.groups;
    } else {
      this.targetGroups = [this.props.groups[this.groupIndex]];
    }
  }

  render() {
    this.getTargetGroups();

    return (
      <main className="container">
      {
        this.targetGroups.map((group) => {
          if (!!group.nShow) {
            return (
              <div key={group.groupTitle+group.groupIndex}>
                <Titlebar app='video' groupIndex={group.groupIndex} collapse={this.groupIndex !== -1}/>
                <VideoListBoard videoObjs={group.itemList} nShow={this.groupIndex === -1 ? group.nShow : undefined}/>
              </div>
            );
          }
        })
      }
      </main>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VideoList));
