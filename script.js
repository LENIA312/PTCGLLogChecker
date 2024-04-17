function applyText() {
    // 自分の名前を取得
    var yourName = document.getElementById("yourName").value.trim();

    var partnerName = null;

    // 入力されたテキストを取得し、行ごとに分割
    var inputText = document.getElementById("inputText").value.trim();
    var lines = inputText.split('\n');

    // テーブルを取得
    var table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];

    // 既存の表を削除
    table.innerHTML = "";

    // 前回の名前とフェーズを初期化
    var previousName;
    var previousPhase;
    var phase;

    // フェーズの一覧を保持する配列
    var phaseList = [];

    // ループで各行のテキストを処理
    lines.forEach(function(line) {
      var trimmedLine = line.trim(); // 各行の前後の空白を削除

      // テキストが空であれば処理をスキップ
      if (trimmedLine === "") {
        return;
      }

      // 名前とフェーズを取得
      var splitIndex = trimmedLine.indexOf(' ');
      var name = trimmedLine.substring(0, splitIndex);
      var textAfterName = trimmedLine.substring(splitIndex + 1);

      // 前回の名前が設定されていなければ、現在の名前を設定
      if (!previousName) {
        previousName = name;
      }

      // 自分の名前が設定されていなければ、現在の名前を自分の名前として設定
      if (!yourName) {
        yourName = name;
      }

      // パートナーの名前を取得
      if (!partnerName && name !== yourName) {
        partnerName = name;
      }

      // Setupフェーズなどの特別な行を処理
      var isDescription = false;

      if (textAfterName.startsWith("Setup")) {
        phase = "Setup";
        return;

      } else if (name.startsWith("Turn")) {
        var phaseSplitIndex = trimmedLine.indexOf('-');
        phase = trimmedLine.substring(0, phaseSplitIndex);
        return;

      } else if (name.startsWith("-") || name.startsWith("•")) {
        // "-"や"•"で始まる行の場合、前の行の名前とフェーズを維持する
        name = previousName;
        phase = previousPhase;
        isDescription = true;

      } else if (name.startsWith("All")) {
        name = null;
        phase = "Game Set";
        textAfterName = trimmedLine;
        isDescription = true;

      } else if (name == (yourName + "'s") || name == (partnerName + "'s")) {
        name = previousName;
        phase = previousPhase;
        textAfterName = trimmedLine;
        isDescription = true;

      } else if (!(name === yourName) && !(name === partnerName)) {
        name = previousName;
        phase = previousPhase;
        textAfterName = trimmedLine;
        isDescription = true;
      }

      // フェーズがまだ配列に追加されていない場合は追加
      if (phase && !phaseList.includes(phase)) {
        phaseList.push(phase);
      }

      // 行を追加
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      cell1.textContent = name;
      cell2.textContent = textAfterName;
      cell3.textContent = phase;

      // 説明行の場合、名前を表示しない
      if (isDescription) {
        cell1.textContent = "";
      }

      // 自分の名前が含まれる場合、セルを薄い緑色に塗る
      if (name === yourName) {
        row.style.backgroundColor = "rgba(144, 238, 144, 0.5)"; // 薄い緑色
      }

      // 自分の名前が含まれる場合、セルを薄いピンクに塗る
      if (phase === "Game Set") {
        row.style.backgroundColor = "rgba(255, 201, 210, 0.5)"; // 薄いピンク
      }

      // 現在の名前とフェーズを更新
      previousName = name;
      previousPhase = phase;
    });

    // プルダウンメニューにフェーズのオプションを追加
    var phaseSelect = document.getElementById("phaseSelector");
    phaseList.forEach(function(phase) {
        var option = document.createElement("option");
        option.value = phase;
        option.textContent = phase;
        phaseSelect.appendChild(option);
    });
}

function PasteText() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("inputText").value = text;
    });
}

function ResetText() {
    document.getElementById("inputText").value = "";
}

function filterTableByPhase() {
    var phaseSelector = document.getElementById("phaseSelector");
    var selectedPhase = phaseSelector.value;

    var rows = document.getElementById("dataTable").getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var phaseCell = rows[i].getElementsByTagName("td")[2];
        if (phaseCell) {
            var phase = phaseCell.textContent || phaseCell.innerText;
            if (selectedPhase === "ALL" || phase === selectedPhase) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

function redirectToPage() {
    window.location.href = "HowToUse.html";
}

function redirectTopPage() {
    window.location.href = "index.html";
}

function redirectTellPage() {
    window.location.href = "form.html";
}
