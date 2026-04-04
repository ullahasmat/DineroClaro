def apply_pagination(query, limit: int = 20, offset: int = 0):
    limit = max(1, min(limit, 100))
    offset = max(0, offset)
    return query.offset(offset).limit(limit)
