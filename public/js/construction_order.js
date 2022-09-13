// 건설사견적내역
function getApi_construction_order(id) {
  num_con_order++;
  console.log("주문내역", num_con_order);
  var lang_kor = {
    decimal: "",
    emptyTable: "데이터가 없습니다.",
    info: "_START_ 부터- _END_ 까지 (총 _TOTAL_ 데이터)",
    infoEmpty: "0개",
    infoFiltered: "(전체 _MAX_명 중 검색결과)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "_MENU_개씩 보기",
    loadingRecords: "로딩중...",
    processing: "처리중...",
    search: "검색 :",
    zeroRecords: "검색된 데이터가 없습니다.",
    paginate: {
      first: "첫 페이지",
      last: "마지막페이지",
      next: "다음",
      previous: "이전",
    },
    aria: {
      sortAscending: ":오름차순 정렬",
      sortDescending: ":내림차순 정렬",
    },
  };

  // window.location.reload();
  var editor; // use a global for the submit and return data rendering in the examples
  // var id = sessionStorage.getItem("id", id);

  if (id === null) {
    retrun;
  }
  $(document).ready(function () {
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/construction_order_history/${id}`,
      table: "#construction_order_table",
      fields: [
        {
          label: "주문아이디",
          name: "assignments.id",
        },
        {
          label: "레미콘 공장",
          name: "spaces.name",
        },
        // {
        //   label: "영업사원명",
        //   name: "users.name",
        // },
        // {
        //   label: "영업사원직책",
        //   name: "users.position",
        // },
        // {
        //   label: "영업사원",
        //   name: "concat(users.name, ' ' ,users.position)",
        // },
        {
          label: "발주처",
          name: "assignments.type",
          type: "select",
        },
        {
          label: "상태",
          name: "assignments.status",
          type: "select",
          value: "요청",
          options: [
            { label: "요청", value: "REQUESTED" },
            { label: "확인", value: "CONFIRMED" },
            { label: "삭제", value: "REMOVE" },
          ],
        },
      ],
    });

    // 항목별 검색기능
    if (num_con_order == 1) {
      $("#construction_order_table thead tr")
        .clone(true)
        .addClass("con_filters_order")
        .appendTo("#construction_order_table thead");
    }
    $("#construction_order_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      // destroy: true,
      // searching: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".con_filters_order th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".con_filters_order th").eq(
                $(api.column(colIdx).header()).index()
              )
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ""
                      ? regexr.replace("{search}", "(((" + this.value + ")))")
                      : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();
              })
              .on("keyup", function (e) {
                e.stopPropagation();

                $(this).trigger("change");
                $(this).focus()[0];
              });
          });
      },
      // 항목별 검색기능 끝. keyid		url:`/api/construction_order_table/:${id}`,
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/construction_order_history/${id}`,
        // type: "get",
      },
      language: lang_kor,
      columns: [
        // { data: "assignments.id"},
        { data: "spaces.name" },
        {
          data: null,
          render: function (data, type, row) {
            return (
              data.assignments.start_time +
              " ~ " +
              data.assignments.end_time.substring(14)
            );
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return (
              data.estimations.norminal_strength_1 +
              " - " +
              data.estimations.slump_1 +
              " | " +
              data.estimations.norminal_strength_2 +
              " - " +
              data.estimations.slump_2 +
              " | " +
              data.estimations.norminal_strength_3 +
              " - " +
              data.estimations.slump_3
            );
          },
        },
        { data: "concat(users.name, ' ' ,users.position)" },

        { data: "assignments.type" },
        {
          data: "assignments.status",
          render: function (data, type, row) {
            switch (data) {
              case "REQUESTED":
                return "요청";
                break;
              case "CONFIRMED":
                return "확인";
                break;
              case "REMOVED":
                return "삭제";
                break;
              case null:
                return "";
                break;
            }
          },
        },
        {
          data:
            "(select count(space_id)" +
            "from space_members where space_id = spaces.id " +
            "group by space_id)",
        },
      ],
      destroy: true,
      select: true,
      buttons: [
        { extend: "create", editor: editor, text: "등록" },
        { extend: "edit", editor: editor, text: "수정" },
        { extend: "remove", editor: editor, text: "삭제" },
        {
          extend: "collection",
          text: "내보내기",
          buttons: ["excel", "csv"],
        },
      ],
    });
  });
}
