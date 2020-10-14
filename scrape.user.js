(() => {
  const scrapeData = () => {
    const sectionKeywords = [
      // 'colors',
      // 'buy',
      // 'summary',
      'capacity',
      'display',
      'measurements',
      'resistance',
      'chip',
      'camera',
      'video-recording',
      'front-camera',
      // 'carriers',
      'cellular',
      'authentication',
      'apple-pay',
      // 'apple-card',
      'video-calling',
      // 'audio-calling',
      'audio-playback',
      'video-playback',
      // 'siri',
      'power-battery',
      'headphones',
      'sensors',
      'sim',
      // 'connector',
    ];

    const getKeywordFromClassList = node => [...node.classList]
      .filter(name => name.startsWith('section-'))[0]
      .replace('section-', '');

    const classListHasKeywordClass = node => sectionKeywords.includes(getKeywordFromClassList(node));

    const action = node => {
      const rowNodes = [...node.querySelectorAll(':scope > div.compare-row')];
      const deviceNames = [...rowNodes[0].querySelectorAll(':scope > div.compare-column')]
        .map(node => node.dataset.content);
      const devices = deviceNames.reduce((obj, name) => {
        obj[name] = [];
        return obj;
      }, {});

      for (const rowNode of rowNodes) {
        const columnNodes = [...rowNode.querySelectorAll(':scope > div.compare-column')];

        for (const columnNode of columnNodes) {
          const device = columnNode.dataset.content;
          const list = columnNode.querySelector(':scope > ul');
          const listItems = list
            ? [...list.querySelectorAll(':scope > li')].map(node => node.textContent.trim())
            : [];
          const paragraph = columnNode.querySelector(':scope > p');
          if (paragraph) [...paragraph.querySelectorAll(':scope .footnote')].forEach(node => node.remove());
          const paragraphTexts = paragraph
            ? [paragraph.textContent.trim()]
            : [];

          // const column = [...listItems, ...paragraphTexts];
          const column = [];

          if (listItems.length > 0) column.push(listItems)
          if (paragraphTexts.length > 0) column.push(...paragraphTexts);

          devices[device].push(...column);
        }
      }

      for (const [key, arr] of Object.entries(devices)) {
        devices[key] = arr.filter(value => typeof value !== 'undefined');
      }

      return devices;
    };

    const rootContainer = document.querySelector('#main > section.section.section-compare-table > div > div.compare.compare-table');
    const sectionNodes = [...rootContainer.querySelectorAll(':scope > div.compare-section')]
      .filter(classListHasKeywordClass);

    const data = sectionNodes.reduce((data, node) => {
      const section = getKeywordFromClassList(node);
      const devices = action(node);
      data[section] = devices;
      return data;
    }, {});

    return data;
  };

  const main = () => {
    const data = scrapeData();
    console.log(JSON.stringify(data));
  };

  main();
})();
