import React, {useEffect, useState} from 'react';
import { Theme, FormControl, Tooltip } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {CustomButton} from '@/components/custom-button';
import { RoleRadio } from '@/components/role-radio';
import {CustomIcon} from '@/components/icon';
import {FormInput} from '@/components/form-input';
import {FormSelect} from '@/components/form-select';
import {LangSelect} from '@/components/lang-select';
import {useHistory, useParams} from 'react-router-dom';
import {GithubIcon} from '@/components/github-icon';
import { t } from '../i18n';
import { useUIStore, useRoomStore, useAppStore } from '@/hooks';
import { UIStore } from '@/stores/app';
import { GlobalStorage } from '@/utils/custom-storage';
import { EduManager } from '@/sdk/education/manager';
import {isElectron} from '@/utils/platform';
import firebaseApp from "@/firebase/firebase";
import firebase from "firebase";

const firestore = firebaseApp.firestore();

const useStyles = makeStyles ((theme: Theme) => ({
  formControl: {
    minWidth: '240px',
    maxWidth: '240px',
  }
}));



type SessionInfo = {
  roomName: string
  roomType: number
  userName: string
  role: string
}

const defaultState: SessionInfo = {
  roomName: '',
  roomType: 0,
  role: '',
  userName: '',
}

const roomTypes = isElectron ?  UIStore.roomTypes.filter((it: any) => it.value !== 3) : UIStore.roomTypes


function HomePage() {
  document.title = t(`home.short_title.title`)

  const classes = useStyles();

  const history = useHistory();

  const uiStore = useUIStore();

  const appStore = useAppStore();

  const [ mainText, setMainText ] = useState("Validating...");

  const { session_id } = useParams();

  const handleSetting = (evt: any) => {
    history.push({pathname: '/setting'})
  }

  const [lock, setLock] = useState<boolean>(false);

  const [session, setSessionInfo] = useState<SessionInfo>(defaultState);

  const [required, setRequired] = useState<any>({} as any);

  useEffect(() => {

    if(session_id){
      // Session ID is the meeting ID
      const docPath = `blaze_session/collections/blaze_sessions/${session_id}`;

      firestore.doc(docPath).get().then((doc) => {
        if(doc.exists){
          // navigate the user to classroom
          const sessionDoc = doc.data();

          if (sessionDoc) {
            const instructorId = sessionDoc.instructor_id;

            firestore.doc(`employees/${instructorId}`).get().then(doc => {
              const userDoc = doc.data();

              if(userDoc){
                setMainText("Joining session...");
                handleSubmit(session_id, userDoc.name);
              }else{
                setMainText("Couldn't find user...");
              }

            });

          }
        }else{
          alert("Invalid meeting ID");
          window.location.href = "https://new-pustack-blaze.web.app"
        }
      });
    }else{
      alert("Invalid meeting ID");
      window.location.href = "https://new-pustack-blaze.web.app"
    }

  }, []);

  const handleSubmit = (roomId : string, teacherName : string) => {
    session.roomName = roomId;
    session.userName = teacherName;
    session.roomType = roomTypes[0];
    session.role = 'teacher';

    setSessionInfo(session);

    appStore.setRoomInfo({
      ...session,
      roomType: roomTypes[0].value
    })
    const path = roomTypes[0].path


    if (session.role === 'assistant') {
      history.push(`/breakout-class/assistant/courses`)
    } else {
      history.push(`/classroom/${path}`)
    }
  }

  return (
    <div className={`flex-container ${uiStore.isElectron ? 'draggable' : 'home-cover-web' }`}>
      {uiStore.isElectron ? null : 
      <div style={{display: "flex"}}>
        <span style={{fontSize: "18px"}}>{mainText}</span>
      </div>
      }
    </div>
  )
}
export default React.memo(HomePage);