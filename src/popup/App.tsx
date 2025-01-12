import { useEffect, useState } from 'react';

import appIcon from '../images/icon-128.png';

const App = () => {
  const [count, setCount] = useState(0);
  const [activeTabId, setActiveTabId] = useState<number>();

  const handleIncrease = async () => {
    const nextCount = count + 1;
    setCount(nextCount);

    if (activeTabId) {
      await chrome.action.setBadgeText({
        tabId: activeTabId,
        text: `${nextCount}`,
      });
    }
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.id) {
        setActiveTabId(currentTab.id);
      }
    });
  }, []);

  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-col w-full gap-8">
        <div className="flex flex-col items-center gap-3">
          <img src={appIcon} alt="App icon" className="w-32" />
          <p className="text-xl">Stylish Extension</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            className="flex justify-center items-center px-3 py-2 rounded-md bg-gray-600 text-white transition-colors hover:bg-gray-700"
            onClick={handleIncrease}
          >
            count: {count}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
