import React, { ReactNode, useEffect, useState } from 'react';
import { useTrackProgress } from 'core/services/trackProgress';
import { setGuid, setWindowId } from 'core/services/kgm/process/process.service';
import './GlobalLoader.less';

const GlobalLoader = ({ children }: { children: ReactNode }) => {
    const isInProgress = useTrackProgress();
    const [isFirstTime, setIsFirstTime] = useState(true);
    useEffect(() => {
        if (isFirstTime) {
            setGuid();
            setWindowId();
        }
        setIsFirstTime(false);
    }, [isFirstTime]);

    const loader = function () {
        return isInProgress ? <div className="loader">
            <div className="inner one"></div>
            <div className="inner two"></div>
            <div className="inner three"></div>
        </div> : <></>;
    }
    return (
        <>
            {loader()}
            {children}
        </>

    )
}

export default GlobalLoader;
